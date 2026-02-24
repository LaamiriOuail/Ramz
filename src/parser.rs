use crate::ast::*;
use crate::lexer::{Lexer, LexerError, Token};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ParserError {
    #[error("خطأ في التحليل: {0}")]
    LexerError(#[from] LexerError),
    #[error("خطأ في السطر {line}: {message}")]
    ParseError { line: usize, message: String },
    #[error("توقع {expected} ولكن وجد {found}")]
    UnexpectedToken { expected: String, found: String },
    #[error("نهاية الملف غير متوقعة")]
    UnexpectedEOF,
}

pub struct Parser {
    tokens: Vec<Token>,
    current: usize,
}

impl Parser {
    pub fn new(tokens: Vec<Token>) -> Self {
        Parser { tokens, current: 0 }
    }

    pub fn parse(&mut self) -> Result<Program, ParserError> {
        let mut statements = Vec::new();

        while !self.is_at_end() {
            statements.push(self.parse_statement()?);
        }

        Ok(Program { statements })
    }

    fn is_at_end(&self) -> bool {
        self.peek() == &Token::EOF
    }

    fn peek(&self) -> &Token {
        if self.current >= self.tokens.len() {
            &self.tokens[self.tokens.len() - 1]
        } else {
            &self.tokens[self.current]
        }
    }

    fn advance(&mut self) -> &Token {
        if !self.is_at_end() {
            self.current += 1;
        }
        &self.tokens[self.current - 1]
    }

    fn check_keyword(&self, keyword: &str) -> bool {
        if let Token::Keyword(k) = self.peek() {
            k == keyword
        } else {
            false
        }
    }

    fn check_operator(&self, op: &str) -> bool {
        if let Token::Operator(o) = self.peek() {
            o == op
        } else {
            false
        }
    }

    fn check_punctuation(&self, punct: &str) -> bool {
        if let Token::Punctuation(p) = self.peek() {
            p == punct
        } else {
            false
        }
    }

    fn match_keyword(&mut self, keyword: &str) -> bool {
        if self.check_keyword(keyword) {
            self.advance();
            true
        } else {
            false
        }
    }

    fn match_operator(&mut self, op: &str) -> bool {
        if self.check_operator(op) {
            self.advance();
            true
        } else {
            false
        }
    }

    fn match_punctuation(&mut self, punct: &str) -> bool {
        if self.check_punctuation(punct) {
            self.advance();
            true
        } else {
            false
        }
    }

    fn parse_statement(&mut self) -> Result<Statement, ParserError> {
        if self.match_keyword("متغير") {
            self.parse_variable_decl()
        } else if self.match_keyword("إذا") {
            self.parse_if()
        } else if self.match_keyword("كرر") {
            self.parse_while()
        } else if self.match_keyword("لكل") {
            self.parse_for()
        } else if self.match_keyword("اكتب") {
            if self.check_punctuation("(") {
                self.parse_function_call("اكتب".to_string())
            } else {
                Ok(Statement::NoOp)
            }
        } else if self.match_keyword("اقرأ") {
            if self.check_punctuation("(") {
                self.parse_function_call("اقرأ".to_string())
            } else {
                Ok(Statement::NoOp)
            }
        } else if let Token::Identifier(name) = self.peek().clone() {
            self.parse_assignment_or_call(name)
        } else {
            self.advance();
            Ok(Statement::NoOp)
        }
    }

    fn parse_variable_decl(&mut self) -> Result<Statement, ParserError> {
        let name = if let Token::Identifier(n) = self.peek().clone() {
            self.advance();
            n
        } else {
            return Err(ParserError::UnexpectedToken {
                expected: "اسم المتغير".to_string(),
                found: format!("{:?}", self.peek()),
            });
        };

        let mut type_annotation = None;
        if self.check_punctuation(":") {
            self.advance();
            type_annotation = Some(self.parse_type()?);
        }

        if !self.match_operator("=") {
            return Err(ParserError::UnexpectedToken {
                expected: "=".to_string(),
                found: format!("{:?}", self.peek()),
            });
        }

        let value = self.parse_expression()?;

        Ok(Statement::VariableDecl {
            name,
            type_annotation,
            value,
        })
    }

    fn parse_type(&mut self) -> Result<crate::types::RamzType, ParserError> {
        let token = self.advance().clone();
        match token {
            Token::Keyword(k) => match k.as_str() {
                "رقم" => Ok(crate::types::RamzType::Number),
                "عشري" => Ok(crate::types::RamzType::Float),
                "نص" => Ok(crate::types::RamzType::String),
                "منطقية" => Ok(crate::types::RamzType::Boolean),
                "قائمة" => Ok(crate::types::RamzType::List),
                "قاموس" => Ok(crate::types::RamzType::Dictionary),
                _ => Err(ParserError::ParseError {
                    line: 0,
                    message: format!("نوع غير معروف: {}", k),
                }),
            },
            Token::Identifier(id) => match id.as_str() {
                "زوج" => Ok(crate::types::RamzType::Tuple),
                _ => Err(ParserError::ParseError {
                    line: 0,
                    message: format!("نوع غير معروف: {}", id),
                }),
            },
            _ => Err(ParserError::UnexpectedToken {
                expected: "نوع".to_string(),
                found: format!("{:?}", token),
            }),
        }
    }

    fn parse_assignment_or_call(&mut self, name: String) -> Result<Statement, ParserError> {
        self.advance();

        if let Token::Operator(op) = self.peek().clone() {
            if op == "=" {
                self.advance();
                let value = self.parse_expression()?;
                return Ok(Statement::Assignment { name, value });
            }
        }

        if let Token::Punctuation(p) = self.peek().clone() {
            if p == "(" {
                return self.parse_function_call(name);
            }
        }

        Ok(Statement::NoOp)
    }

    fn parse_function_call(&mut self, name: String) -> Result<Statement, ParserError> {
        if !self.match_punctuation("(") {
            return Err(ParserError::UnexpectedToken {
                expected: "(".to_string(),
                found: format!("{:?}", self.peek()),
            });
        }

        let mut args = Vec::new();
        if !self.check_punctuation(")") {
            loop {
                args.push(self.parse_expression()?);
                if !self.match_punctuation(",") {
                    break;
                }
            }
        }

        if !self.match_punctuation(")") {
            return Err(ParserError::UnexpectedToken {
                expected: ")".to_string(),
                found: format!("{:?}", self.peek()),
            });
        }

        Ok(Statement::FunctionCall { name, args })
    }

    fn parse_if(&mut self) -> Result<Statement, ParserError> {
        let condition = self.parse_expression()?;

        let then_stmt = Box::new(self.parse_statement()?);

        let mut else_stmt = None;
        if self.match_keyword("وإلا") {
            else_stmt = Some(Box::new(self.parse_statement()?));
        }

        Ok(Statement::If {
            condition,
            then_stmt,
            else_stmt,
        })
    }

    fn parse_while(&mut self) -> Result<Statement, ParserError> {
        let condition = self.parse_expression()?;
        let body = Box::new(self.parse_statement()?);

        Ok(Statement::While { condition, body })
    }

    fn parse_for(&mut self) -> Result<Statement, ParserError> {
        let variable = if let Token::Identifier(v) = self.peek().clone() {
            self.advance();
            v
        } else {
            return Err(ParserError::UnexpectedToken {
                expected: "اسم المتغير".to_string(),
                found: format!("{:?}", self.peek()),
            });
        };

        if !self.match_keyword("في") {
            return Err(ParserError::UnexpectedToken {
                expected: "في".to_string(),
                found: format!("{:?}", self.peek()),
            });
        }

        let iterable = self.parse_expression()?;
        let body = Box::new(self.parse_statement()?);

        Ok(Statement::For {
            variable,
            iterable,
            body,
        })
    }

    fn parse_expression(&mut self) -> Result<Expr, ParserError> {
        self.parse_comparison()
    }

    fn parse_comparison(&mut self) -> Result<Expr, ParserError> {
        let mut expr = self.parse_term()?;

        while let Token::Operator(op) = self.peek().clone() {
            if ["==", "!=", "<", "<=", ">", ">="].contains(&op.as_str()) {
                self.advance();
                let right = self.parse_term()?;
                let binary_op = match op.as_str() {
                    "==" => BinaryOperator::Equal,
                    "!=" => BinaryOperator::NotEqual,
                    "<" => BinaryOperator::LessThan,
                    "<=" => BinaryOperator::LessEqual,
                    ">" => BinaryOperator::GreaterThan,
                    ">=" => BinaryOperator::GreaterEqual,
                    _ => unreachable!(),
                };
                expr = Expr::BinaryOp {
                    left: Box::new(expr),
                    op: binary_op,
                    right: Box::new(right),
                };
            } else {
                break;
            }
        }

        Ok(expr)
    }

    fn parse_term(&mut self) -> Result<Expr, ParserError> {
        let mut expr = self.parse_factor()?;

        while let Token::Operator(op) = self.peek().clone() {
            if ["+", "-"].contains(&op.as_str()) {
                self.advance();
                let right = self.parse_factor()?;
                let binary_op = match op.as_str() {
                    "+" => BinaryOperator::Add,
                    "-" => BinaryOperator::Subtract,
                    _ => unreachable!(),
                };
                expr = Expr::BinaryOp {
                    left: Box::new(expr),
                    op: binary_op,
                    right: Box::new(right),
                };
            } else {
                break;
            }
        }

        Ok(expr)
    }

    fn parse_factor(&mut self) -> Result<Expr, ParserError> {
        let mut expr = self.parse_unary()?;

        while let Token::Operator(op) = self.peek().clone() {
            if ["*", "/", "%"].contains(&op.as_str()) {
                self.advance();
                let right = self.parse_unary()?;
                let binary_op = match op.as_str() {
                    "*" => BinaryOperator::Multiply,
                    "/" => BinaryOperator::Divide,
                    "%" => BinaryOperator::Modulo,
                    _ => unreachable!(),
                };
                expr = Expr::BinaryOp {
                    left: Box::new(expr),
                    op: binary_op,
                    right: Box::new(right),
                };
            } else {
                break;
            }
        }

        Ok(expr)
    }

    fn parse_unary(&mut self) -> Result<Expr, ParserError> {
        if let Token::Operator(op) = self.peek().clone() {
            if op == "!" || op == "-" {
                self.advance();
                let expr = self.parse_unary()?;
                let unary_op = match op.as_str() {
                    "!" => UnaryOperator::Not,
                    "-" => UnaryOperator::Minus,
                    _ => unreachable!(),
                };
                return Ok(Expr::UnaryOp {
                    op: unary_op,
                    expr: Box::new(expr),
                });
            }
        }

        self.parse_primary()
    }

    fn parse_primary(&mut self) -> Result<Expr, ParserError> {
        let token = self.advance().clone();
        match token {
            Token::Number(n) => Ok(Expr::Literal(crate::types::RamzValue::Number(n))),
            Token::Float(f) => Ok(Expr::Literal(crate::types::RamzValue::Float(f))),
            Token::String(s) => Ok(Expr::Literal(crate::types::RamzValue::String(s))),
            Token::Boolean(b) => Ok(Expr::Literal(crate::types::RamzValue::Boolean(b))),
            Token::Identifier(name) => {
                if self.check_punctuation("(") {
                    self.parse_function_call_expr(name)
                } else {
                    Ok(Expr::Variable(name))
                }
            }
            Token::Keyword(k) if (k == "اقرأ" || k == "اكتب") && self.check_punctuation("(") => {
                self.parse_function_call_expr(k)
            }
            Token::Punctuation(p) if p == "[" => self.parse_list(),
            Token::Punctuation(p) if p == "{" => self.parse_dictionary(),
            Token::Punctuation(p) if p == "(" => self.parse_tuple_or_group(),
            token => Err(ParserError::UnexpectedToken {
                expected: "قيمة أو متغير".to_string(),
                found: format!("{:?}", token),
            }),
        }
    }

    fn parse_function_call_expr(&mut self, name: String) -> Result<Expr, ParserError> {
        let mut args = Vec::new();
        self.advance();

        if !self.check_punctuation(")") {
            loop {
                args.push(self.parse_expression()?);
                if !self.match_punctuation(",") {
                    break;
                }
            }
        }

        if !self.match_punctuation(")") {
            return Err(ParserError::UnexpectedToken {
                expected: ")".to_string(),
                found: format!("{:?}", self.peek()),
            });
        }

        Ok(Expr::Call { name, args })
    }

    fn parse_list(&mut self) -> Result<Expr, ParserError> {
        let mut items = Vec::new();

        while !self.check_punctuation("]") {
            items.push(self.parse_expression()?);
            if !self.match_punctuation(",") {
                break;
            }
        }

        self.advance();
        Ok(Expr::List(items))
    }

    fn parse_dictionary(&mut self) -> Result<Expr, ParserError> {
        let mut pairs = Vec::new();

        while !self.check_punctuation("}") {
            let key = if let Token::String(s) = self.advance().clone() {
                s
            } else {
                return Err(ParserError::UnexpectedToken {
                    expected: "مفتاح نصي".to_string(),
                    found: format!("{:?}", self.peek()),
                });
            };

            if !self.match_punctuation(":") {
                return Err(ParserError::UnexpectedToken {
                    expected: ":".to_string(),
                    found: format!("{:?}", self.peek()),
                });
            }

            let value = self.parse_expression()?;
            pairs.push((key, value));

            if !self.match_punctuation(",") {
                break;
            }
        }

        self.advance();
        Ok(Expr::Dictionary(pairs))
    }

    fn parse_tuple_or_group(&mut self) -> Result<Expr, ParserError> {
        let mut items = Vec::new();

        if !self.check_punctuation(")") {
            items.push(self.parse_expression()?);
            while self.match_punctuation(",") {
                items.push(self.parse_expression()?);
            }
        }

        self.advance();

        if items.len() == 1 {
            Ok(items.pop().unwrap())
        } else {
            Ok(Expr::Tuple(items))
        }
    }
}
