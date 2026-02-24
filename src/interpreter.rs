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

#[derive(Debug, Clone, PartialEq)]
enum ExecuteFlag {
    Normal,
    Break,
    Continue,
}

#[derive(Debug, Clone, PartialEq)]
enum ExecuteFlag {
    Normal,
    Break,
    Continue,
    Return,
}

#[derive(Debug, Clone)]
pub struct FunctionDef {
    pub params: Vec<String>,
    pub body: Box<Statement>,
    pub closure: Environment,
}

pub struct Environment {
    variables: HashMap<String, (RamzValue, Option<RamzType>)>,
    functions: HashMap<String, FunctionDef>,
    parent: Option<Box<Environment>>,
}

impl Environment {
    pub fn new() -> Self {
        Environment {
            variables: HashMap::new(),
            functions: HashMap::new(),
            parent: None,
        }
    }

    pub fn with_parent(parent: Environment) -> Self {
        Environment {
            variables: HashMap::new(),
            functions: HashMap::new(),
            parent: Some(Box::new(parent)),
        }
    }

    pub fn define(&mut self, name: String, value: RamzValue, type_annotation: Option<RamzType>) {
        self.variables.insert(name, (value, type_annotation));
    }

    pub fn define_function(&mut self, name: String, function_def: FunctionDef) {
        self.functions.insert(name, function_def);
    }

    pub fn get(&self, name: &str) -> Result<&RamzValue, InterpreterError> {
        if let Some(v) = self.variables.get(name) {
            Ok(v)
        } else if let Some(parent) = &self.parent {
            parent.get(name)
        } else {
            Err(InterpreterError::UndefinedVariable(name.to_string()))
        }
    }

    pub fn get_function(&self, name: &str) -> Option<&FunctionDef> {
        self.functions.get(name)
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

    pub fn push_scope(&mut self) -> Environment {
        Environment {
            variables: HashMap::new(),
            functions: self.functions.clone(),
            parent: Some(Box::new(std::mem::replace(
                self,
                Environment {
                    variables: HashMap::new(),
                    functions: HashMap::new(),
                    parent: None,
                },
            ))),
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
            let (_, flag) = self.execute_statement(stmt)?;
            if matches!(flag, ExecuteFlag::Break) {
                return Err(InterpreterError::RuntimeError("اوقف خارج حلقة".to_string()));
            }
            if matches!(flag, ExecuteFlag::Continue) {
                return Err(InterpreterError::RuntimeError("تخطى خارج حلقة".to_string()));
            }
            if matches!(flag, ExecuteFlag::Return) {
                return Err(InterpreterError::RuntimeError("ارجع خارج دالة".to_string()));
            }
        }
        Ok(())
    }

    fn execute_statement(
        &mut self,
        stmt: &Statement,
    ) -> Result<(RamzValue, ExecuteFlag), InterpreterError> {
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
                Ok((RamzValue::Boolean(true), ExecuteFlag::Normal))
            }
            Statement::FunctionDecl {
                name,
                params,
                return_type: _,
                body,
            } => {
                let function_def = FunctionDef {
                    params: params.clone(),
                    body: body.clone(),
                    closure: std::mem::replace(
                        &mut self.env,
                        Environment {
                            variables: HashMap::new(),
                            functions: self.env.functions.clone(),
                            parent: None,
                        },
                    ),
                };
                self.env.define_function(name.clone(), function_def);
                Ok((RamzValue::Boolean(true), ExecuteFlag::Normal))
            }
            Statement::Return { value } => {
                let evaluated_value = self.evaluate_expr(value)?;
                Ok((evaluated_value, ExecuteFlag::Return))
            }
            Statement::Assignment { name, value } => {
                let evaluated_value = self.evaluate_expr(value)?;
                self.env.set(name, evaluated_value)?;
                Ok((RamzValue::Boolean(true), ExecuteFlag::Normal))
            }
            Statement::FunctionCall { name, args } => {
                let mut evaluated_args = Vec::new();
                for arg in args {
                    evaluated_args.push(self.evaluate_expr(arg)?);
                }
                let result = self.call_function(name, &evaluated_args)?;
                Ok((result, ExecuteFlag::Normal))
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
                    Ok((RamzValue::Boolean(true), ExecuteFlag::Normal))
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
                    let (res, flag) = self.execute_statement(body)?;
                    result = res;
                    match flag {
                        ExecuteFlag::Break => break,
                        ExecuteFlag::Continue => continue,
                        ExecuteFlag::Return => return Ok((result, ExecuteFlag::Return)),
                        ExecuteFlag::Normal => {}
                    }
                }
                Ok((result, ExecuteFlag::Normal))
            }
            Statement::DoWhile { body, condition } => {
                let mut result = RamzValue::Boolean(true);
                loop {
                    let (res, flag) = self.execute_statement(body)?;
                    result = res;
                    match flag {
                        ExecuteFlag::Break => break,
                        ExecuteFlag::Continue => continue,
                        ExecuteFlag::Return => break,
                        ExecuteFlag::Normal => {}
                    }

                    let cond = self.evaluate_expr(condition)?;
                    let is_true = matches!(cond, RamzValue::Boolean(true));
                    if !is_true {
                        break;
                    }
                }
                Ok((result, ExecuteFlag::Normal))
            }
            Statement::For {
                variable,
                start,
                end,
                step,
                iterable,
                body,
            } => {
                let mut result = RamzValue::Boolean(true);

                // Range-based for loop
                if let (Some(start_expr), Some(end_expr)) = (start, end) {
                    let start_val = self.evaluate_expr(start_expr)?;
                    let end_val = self.evaluate_expr(end_expr)?;
                    let step_val = match step.as_ref() {
                        Some(s) => self.evaluate_expr(s)?,
                        None => RamzValue::Number(1),
                    };

                    match (start_val, end_val, step_val) {
                        (RamzValue::Number(s), RamzValue::Number(e), RamzValue::Number(st)) => {
                            if st == 0 {
                                return Err(InterpreterError::TypeError(
                                    "خطوة صفر غير مسموحة".to_string(),
                                ));
                            }
                            let current = if st > 0 { s..=e } else { e..=s };
                            for i in current.step_by(st.unsigned_abs() as usize) {
                                self.env
                                    .define(variable.clone(), RamzValue::Number(i), None);
                                let (res, flag) = self.execute_statement(body)?;
                                result = res;
                                match flag {
                                    ExecuteFlag::Break => break,
                                    ExecuteFlag::Continue => continue,
                                    ExecuteFlag::Return => return Ok((result, ExecuteFlag::Return)),
                                    ExecuteFlag::Normal => {}
                                }
                            }
                        }
                        RamzValue::Tuple(items) => {
                            for item in items {
                                self.env.define(variable.clone(), item.clone(), None);
                                let (res, flag) = self.execute_statement(body)?;
                                result = res;
                                match flag {
                                    ExecuteFlag::Break => break,
                                    ExecuteFlag::Continue => continue,
                                    ExecuteFlag::Return => return Ok((result, ExecuteFlag::Return)),
                                    ExecuteFlag::Normal => {}
                                }
                            }
                        }
                        }
                        _ => {
                            return Err(InterpreterError::TypeError(
                                "يجب أن تكون القيم أرقام في نطاق الحلقة".to_string(),
                            ));
                        }
                    }
                    
                    Ok((result, ExecuteFlag::Normal))
                } else {
                    return Err(InterpreterError::RuntimeError("حلقة غير صالحة".to_string()));
                }
            }
            Statement::Block(stmts) => {
                let mut result = RamzValue::Boolean(true);
                for stmt in stmts {
                    let (res, flag) = self.execute_statement(stmt)?;
                    result = res;
                    if matches!(flag, ExecuteFlag::Break | ExecuteFlag::Continue | ExecuteFlag::Return) {
                        return Ok((result, flag));
                    }
                }
                Ok((result, ExecuteFlag::Normal))
            }
            Statement::Break => Ok((RamzValue::Boolean(true), ExecuteFlag::Break)),
            Statement::Continue => Ok((RamzValue::Boolean(true), ExecuteFlag::Continue)),
            Statement::NoOp => Ok((RamzValue::Boolean(true), ExecuteFlag::Normal)),
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
            (RamzValue::String(l), RamzValue::Number(r), BinaryOperator::Add) => {
                Ok(RamzValue::String(l.clone() + &r.to_string()))
            }
            (RamzValue::Number(l), RamzValue::String(r), BinaryOperator::Add) => {
                Ok(RamzValue::String(l.to_string() + r))
            }
            (RamzValue::String(l), RamzValue::Float(r), BinaryOperator::Add) => {
                Ok(RamzValue::String(l.clone() + &r.to_string()))
            }
            (RamzValue::Float(l), RamzValue::String(r), BinaryOperator::Add) => {
                Ok(RamzValue::String(l.to_string() + r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::Equal) => {
                Ok(RamzValue::Boolean(l == r))
            }
            (RamzValue::Number(l), RamzValue::Number(r), BinaryOperator::NotEqual) => {
                Ok(RamzValue::Boolean(l != r))
            }
            (RamzValue::String(l), RamzValue::String(r), BinaryOperator::Equal) => {
                Ok(RamzValue::Boolean(l == r))
            }
            (RamzValue::String(l), RamzValue::String(r), BinaryOperator::NotEqual) => {
                Ok(RamzValue::Boolean(l != r))
            }
            (RamzValue::Boolean(l), RamzValue::Boolean(r), BinaryOperator::Equal) => {
                Ok(RamzValue::Boolean(l == r))
            }
            (RamzValue::Boolean(l), RamzValue::Boolean(r), BinaryOperator::NotEqual) => {
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
            "ادع" => {
                if args.is_empty() {
                    return Err(InterpreterError::RuntimeError(
                        "دالة ادع تتطلب اسم الدالة وربما وسيطاً".to_string()
                    ));
                }
                
                if args.len() < 2 {
                    return Err(InterpreterError::RuntimeError(
                        "دالة ادع تتطلب اسم الدالة وواحد وسيط على الأقل".to_string()
                    ));
                }
                
                let function_name = if let RamzValue::String(func_name) = &args[0] {
                    func_name.clone()
                } else {
                    return Err(InterpreterError::RuntimeError(
                        "دالة ادع تتطلب اسم الدالة كنص أول".to_string()
                    ));
                };
                
                let func_args = &args[1..];
                
                if let Some(function_def) = self.env.get_function(function_name) {
                    let mut local_env = Environment {
                        variables: HashMap::new(),
                        functions: function_def.closure.functions.clone(),
                        parent: Some(Box::new(Environment {
                            variables: self.env.variables.clone(),
                            functions: self.env.functions.clone(),
                            parent: None,
                        })),
                    };
                    
                    for (param, arg) in function_def.params.iter().zip(func_args) {
                        local_env.define(param.clone(), arg.clone(), None);
                    }
                    
                    let mut interpreter = Interpreter { env: local_env };
                    let (result, _) = interpreter.execute_statement(&function_def.body)?;
                    Ok(result)
                } else {
                    Err(InterpreterError::RuntimeError(format!(
                        "الدالة '{}' غير معرفة",
                        function_name
                    )))
                }
            }
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
