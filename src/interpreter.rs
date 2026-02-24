use crate::ast::*;
use crate::types::{RamzType, RamzValue};
use std::collections::HashMap;
use std::io::{self, Write};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum InterpreterError {
    #[error("المتغير '{0}' غير معرف")]
    UndefinedVariable(String),
    #[error("نوع غير صالح: {0}")]
    TypeError(String),
    #[error("خطأ في العملية: {0}")]
    RuntimeError(String),
    #[error("خطأ في الإدخال: {0}")]
    InputError(String),
}

pub struct Environment {
    variables: HashMap<String, (RamzValue, Option<RamzType>)>,
}

impl Environment {
    pub fn new() -> Self {
        Environment {
            variables: HashMap::new(),
        }
    }

    pub fn define(&mut self, name: String, value: RamzValue, type_annotation: Option<RamzType>) {
        self.variables.insert(name, (value, type_annotation));
    }

    pub fn get(&self, name: &str) -> Result<&RamzValue, InterpreterError> {
        self.variables
            .get(name)
            .map(|(v, _)| v)
            .ok_or_else(|| InterpreterError::UndefinedVariable(name.to_string()))
    }

    pub fn set(&mut self, name: &str, value: RamzValue) -> Result<(), InterpreterError> {
        if let Some((existing_value, type_annotation)) = self.variables.get_mut(name) {
            if let Some(t) = type_annotation {
                if value.get_type() != *t {
                    return Err(InterpreterError::TypeError(format!(
                        "لا يمكن تعيين نوع {} لمتغير من نوع {}",
                        value.get_type(),
                        t
                    )));
                }
            }
            *existing_value = value;
            Ok(())
        } else {
            Err(InterpreterError::UndefinedVariable(name.to_string()))
        }
    }
}

pub struct Interpreter {
    env: Environment,
}

impl Interpreter {
    pub fn new() -> Self {
        Interpreter {
            env: Environment::new(),
        }
    }

    pub fn interpret(&mut self, program: &Program) -> Result<(), InterpreterError> {
        for stmt in &program.statements {
            self.execute_statement(stmt)?;
        }
        Ok(())
    }

    fn execute_statement(&mut self, stmt: &Statement) -> Result<RamzValue, InterpreterError> {
        match stmt {
            Statement::VariableDecl {
                name,
                type_annotation,
                value,
            } => {
                let evaluated_value = self.evaluate_expr(value)?;

                if let Some(t) = type_annotation {
                    if evaluated_value.get_type() != *t {
                        return Err(InterpreterError::TypeError(format!(
                            "لا يمكن تعيين نوع {} لمتغير من نوع {}",
                            evaluated_value.get_type(),
                            t
                        )));
                    }
                }

                self.env
                    .define(name.clone(), evaluated_value, type_annotation.clone());
                Ok(RamzValue::Boolean(true))
            }
            Statement::Assignment { name, value } => {
                let evaluated_value = self.evaluate_expr(value)?;
                self.env.set(name, evaluated_value)?;
                Ok(RamzValue::Boolean(true))
            }
            Statement::FunctionCall { name, args } => {
                let mut evaluated_args = Vec::new();
                for arg in args {
                    evaluated_args.push(self.evaluate_expr(arg)?);
                }
                self.call_function(name, &evaluated_args)
            }
            Statement::If {
                condition,
                then_stmt,
                else_stmt,
            } => {
                let cond = self.evaluate_expr(condition)?;
                let is_true = matches!(cond, RamzValue::Boolean(true));

                if is_true {
                    self.execute_statement(then_stmt)
                } else if let Some(els) = else_stmt {
                    self.execute_statement(els)
                } else {
                    Ok(RamzValue::Boolean(true))
                }
            }
            Statement::While { condition, body } => {
                let mut result = RamzValue::Boolean(true);
                loop {
                    let cond = self.evaluate_expr(condition)?;
                    let is_true = matches!(cond, RamzValue::Boolean(true));
                    if !is_true {
                        break;
                    }
                    result = self.execute_statement(body)?;
                }
                Ok(result)
            }
            Statement::For {
                variable,
                iterable,
                body,
            } => {
                let iter = self.evaluate_expr(iterable)?;
                let mut result = RamzValue::Boolean(true);

                match iter {
                    RamzValue::List(items) => {
                        for item in items {
                            self.env.define(variable.clone(), item.clone(), None);
                            result = self.execute_statement(body)?;
                        }
                    }
                    RamzValue::Tuple(items) => {
                        for item in items {
                            self.env.define(variable.clone(), item.clone(), None);
                            result = self.execute_statement(body)?;
                        }
                    }
                    _ => {
                        return Err(InterpreterError::TypeError(
                            "يجب أن يكون التكرار على قائمة أو زوج".to_string(),
                        ));
                    }
                }

                Ok(result)
            }
            Statement::Block(stmts) => {
                let mut result = RamzValue::Boolean(true);
                for stmt in stmts {
                    result = self.execute_statement(stmt)?;
                }
                Ok(result)
            }
            Statement::NoOp => Ok(RamzValue::Boolean(true)),
        }
    }

    fn evaluate_expr(&mut self, expr: &Expr) -> Result<RamzValue, InterpreterError> {
        match expr {
            Expr::Literal(value) => Ok(value.clone()),
            Expr::Variable(name) => self.env.get(name).cloned(),
            Expr::BinaryOp { left, op, right } => {
                let left_val = self.evaluate_expr(left)?;
                let right_val = self.evaluate_expr(right)?;
                self.apply_binary_op(&left_val, op, &right_val)
            }
            Expr::UnaryOp { op, expr: e } => {
                let val = self.evaluate_expr(e)?;
                self.apply_unary_op(op, &val)
            }
            Expr::Call { name, args } => {
                let mut evaluated_args = Vec::new();
                for arg in args {
                    evaluated_args.push(self.evaluate_expr(arg)?);
                }
                self.call_function(name, &evaluated_args)
            }
            Expr::List(items) => {
                let mut evaluated = Vec::new();
                for item in items {
                    evaluated.push(self.evaluate_expr(item)?);
                }
                Ok(RamzValue::List(evaluated))
            }
            Expr::Dictionary(pairs) => {
                let mut result = Vec::new();
                for (key, value) in pairs {
                    let evaluated_value = self.evaluate_expr(value)?;
                    result.push((key.clone(), evaluated_value));
                }
                Ok(RamzValue::Dictionary(result))
            }
            Expr::Tuple(items) => {
                let mut evaluated = Vec::new();
                for item in items {
                    evaluated.push(self.evaluate_expr(item)?);
                }
                Ok(RamzValue::Tuple(evaluated))
            }
        }
    }

    fn apply_binary_op(
        &self,
        left: &RamzValue,
        op: &BinaryOperator,
        right: &RamzValue,
    ) -> Result<RamzValue, InterpreterError> {
        match (left, right, op) {
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::Add) => {
                Ok(RamzValue::Number(l + r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::Subtract) => {
                Ok(RamzValue::Number(l - r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::Multiply) => {
                Ok(RamzValue::Number(l * r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::Divide) => {
                if *r == 0 {
                    return Err(InterpreterError::RuntimeError(
                        "لا يمكن القسمة على صفر".to_string(),
                    ));
                }
                Ok(RamzValue::Number(l / r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::Modulo) => {
                if *r == 0 {
                    return Err(InterpreterError::RuntimeError(
                        "لا يمكن القسمة على صفر".to_string(),
                    ));
                }
                Ok(RamzValue::Number(l % r))
            }
            (RamzValue::Float(l), RamzValue::Float(r), BinaryOperator::Add) => {
                Ok(RamzValue::Float(l + r))
            }
            (RamzValue::Float(l), RamzValue::Float(r), BinaryOperator::Subtract) => {
                Ok(RamzValue::Float(l - r))
            }
            (RamzValue::Float(l), RamzValue::Float(r), BinaryOperator::Multiply) => {
                Ok(RamzValue::Float(l * r))
            }
            (RamzValue::Float(l), RamzValue::Float(r), BinaryOperator::Divide) => {
                if *r == 0.0 {
                    return Err(InterpreterError::RuntimeError(
                        "لا يمكن القسمة على صفر".to_string(),
                    ));
                }
                Ok(RamzValue::Float(l / r))
            }
            (RamzValue::String(l), RamzValue::String(r), BinaryOperator::Add) => {
                Ok(RamzValue::String(l.clone() + r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::Equal) => {
                Ok(RamzValue::Boolean(l == r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::NotEqual) => {
                Ok(RamzValue::Boolean(l != r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::LessThan) => {
                Ok(RamzValue::Boolean(l < r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::LessEqual) => {
                Ok(RamzValue::Boolean(l <= r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::GreaterThan) => {
                Ok(RamzValue::Boolean(l > r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::GreaterEqual) => {
                Ok(RamzValue::Boolean(l >= r))
            }
            (RamzValue::Boolean(l), RamzValue::Boolean(r), BinaryOperator::And) => {
                Ok(RamzValue::Boolean(*l && *r))
            }
            (RamzValue::Boolean(l), RamzValue::Boolean(r), BinaryOperator::Or) => {
                Ok(RamzValue::Boolean(*l || *r))
            }
            _ => Err(InterpreterError::TypeError(format!(
                "لا يمكن تطبيق العملية على الأنواع {} و {}",
                left.get_type(),
                right.get_type()
            ))),
        }
    }

    fn apply_unary_op(
        &self,
        op: &UnaryOperator,
        value: &RamzValue,
    ) -> Result<RamzValue, InterpreterError> {
        match (op, value) {
            (UnaryOperator::Not, RamzValue::Boolean(b)) => Ok(RamzValue::Boolean(!b)),
            (UnaryOperator::Minus, RamzValue::Number(n)) => Ok(RamzValue::Number(-n)),
            (UnaryOperator::Minus, RamzValue::Float(f)) => Ok(RamzValue::Float(-f)),
            _ => Err(InterpreterError::TypeError(format!(
                "لا يمكن تطبيق العملية على النوع {}",
                value.get_type()
            ))),
        }
    }

    fn call_function(
        &mut self,
        name: &str,
        args: &[RamzValue],
    ) -> Result<RamzValue, InterpreterError> {
        match name {
            "اكتب" => {
                let output: String = args
                    .iter()
                    .map(|a| format!("{}", a))
                    .collect::<Vec<_>>()
                    .join("");
                println!("{}", output);
                Ok(RamzValue::Boolean(true))
            }
            "اقرأ" => {
                let mut input = String::new();

                if args.len() == 1 {
                    if let RamzValue::String(prompt) = &args[0] {
                        print!("{}", prompt);
                        io::stdout()
                            .flush()
                            .map_err(|e| InterpreterError::InputError(e.to_string()))?;
                    }
                }

                io::stdin()
                    .read_line(&mut input)
                    .map_err(|e| InterpreterError::InputError(e.to_string()))?;

                let input = input.trim();

                if input.parse::<i64>().is_ok() {
                    Ok(RamzValue::Number(input.parse().unwrap()))
                } else if input.parse::<f64>().is_ok() {
                    Ok(RamzValue::Float(input.parse().unwrap()))
                } else if input == "صحيح" {
                    Ok(RamzValue::Boolean(true))
                } else if input == "خطأ" {
                    Ok(RamzValue::Boolean(false))
                } else {
                    Ok(RamzValue::String(input.to_string()))
                }
            }
            _ => Err(InterpreterError::RuntimeError(format!(
                "الدالة '{}' غير موجودة",
                name
            ))),
        }
    }
}
