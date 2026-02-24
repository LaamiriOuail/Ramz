use std::iter::Peekable;
use std::str::Chars;
use thiserror::Error;

#[derive(Debug, Clone, PartialEq)]
pub enum Token {
    Keyword(String),
    Identifier(String),
    Number(i64),
    Float(f64),
    String(String),
    Boolean(bool),
    Operator(String),
    Punctuation(String),
    EOF,
}

#[derive(Error, Debug)]
pub enum LexerError {
    #[error("خطأ في تحليل النص: {0}")]
    InvalidCharacter(char),
    #[error("خطأ في السطر {line}, العمود {column}: {message}")]
    ParseError {
        line: usize,
        column: usize,
        message: String,
    },
    #[error("خطأ في النص: {0}")]
    UnterminatedString(String),
}

pub struct Lexer<'a> {
    input: Peekable<Chars<'a>>,
    line: usize,
    column: usize,
}

impl<'a> Lexer<'a> {
    pub fn new(input: &'a str) -> Self {
        Lexer {
            input: input.chars().peekable(),
            line: 1,
            column: 1,
        }
    }

    pub fn tokenize(&mut self) -> Result<Vec<Token>, LexerError> {
        let mut tokens = Vec::new();

        while let Some(&ch) = self.input.peek() {
            match ch {
                ' ' | '\t' => {
                    self.consume();
                }
                '\n' => {
                    self.consume();
                    self.line += 1;
                    self.column = 1;
                }
                '#' => {
                    self.skip_comment();
                }
                '"' => {
                    tokens.push(self.read_string()?);
                }
                '0'..='9' => {
                    tokens.push(self.read_number()?);
                }
                '+' | '-' | '*' | '/' | '%' | '=' | '!' | '<' | '>' => {
                    tokens.push(self.read_operator());
                }
                '[' | ']' | '{' | '}' | '(' | ')' | ',' | ':' => {
                    tokens.push(self.read_punctuation());
                }
                _ if ch.is_arabic() || ch.is_alphabetic() => {
                    tokens.push(self.read_identifier_or_keyword()?);
                }
                _ => {
                    return Err(LexerError::InvalidCharacter(ch));
                }
            }
        }

        tokens.push(Token::EOF);
        Ok(tokens)
    }

    fn consume(&mut self) -> char {
        let ch = self.input.next().unwrap();
        self.column += 1;
        ch
    }

    fn peek(&mut self) -> Option<&char> {
        self.input.peek()
    }

    fn skip_comment(&mut self) {
        while let Some(&ch) = self.peek() {
            if ch == '\n' {
                break;
            }
            self.consume();
        }
    }

    fn read_string(&mut self) -> Result<Token, LexerError> {
        let start_col = self.column;
        self.consume();
        let mut s = String::new();

        while let Some(&ch) = self.peek() {
            if ch == '"' {
                self.consume();
                return Ok(Token::String(s));
            }
            s.push(self.consume());
        }

        Err(LexerError::UnterminatedString(format!(
            "السطر {}, العمود {}",
            self.line, start_col
        )))
    }

    fn read_number(&mut self) -> Result<Token, LexerError> {
        let mut num_str = String::new();
        let mut has_dot = false;

        while let Some(&ch) = self.peek() {
            if ch.is_digit(10) {
                num_str.push(self.consume());
            } else if ch == '.' && !has_dot {
                has_dot = true;
                num_str.push(self.consume());
            } else {
                break;
            }
        }

        if has_dot {
            let value: f64 = num_str.parse().map_err(|_| LexerError::ParseError {
                line: self.line,
                column: self.column,
                message: format!("لا يمكن قراءة الرقم: {}", num_str),
            })?;
            Ok(Token::Float(value))
        } else {
            let value: i64 = num_str.parse().map_err(|_| LexerError::ParseError {
                line: self.line,
                column: self.column,
                message: format!("لا يمكن قراءة الرقم: {}", num_str),
            })?;
            Ok(Token::Number(value))
        }
    }

    fn read_identifier_or_keyword(&mut self) -> Result<Token, LexerError> {
        let mut name = String::new();

        while let Some(&ch) = self.peek() {
            if ch.is_arabic() || ch.is_alphabetic() || ch.is_digit(10) || ch == '_' {
                name.push(self.consume());
            } else {
                break;
            }
        }

        match name.as_str() {
            "متغير" => Ok(Token::Keyword("متغير".to_string())),
            "رقم" => Ok(Token::Keyword("رقم".to_string())),
            "عشري" => Ok(Token::Keyword("عشري".to_string())),
            "نص" => Ok(Token::Keyword("نص".to_string())),
            "منطقية" => Ok(Token::Keyword("منطقية".to_string())),
            "قائمة" => Ok(Token::Keyword("قائمة".to_string())),
            "قاموس" => Ok(Token::Keyword("قاموس".to_string())),
            "إذا" => Ok(Token::Keyword("إذا".to_string())),
            "وإلا" => Ok(Token::Keyword("وإلا".to_string())),
            "كرر" => Ok(Token::Keyword("كرر".to_string())),
            "لكل" => Ok(Token::Keyword("لكل".to_string())),
            "في" => Ok(Token::Keyword("في".to_string())),
            "افعل" => Ok(Token::Keyword("افعل".to_string())),
            "طالما" => Ok(Token::Keyword("طالما".to_string())),
            "من" => Ok(Token::Keyword("من".to_string())),
            "إلى" => Ok(Token::Keyword("إلى".to_string())),
            "خطوة" => Ok(Token::Keyword("خطوة".to_string())),
            "اوقف" => Ok(Token::Keyword("اوقف".to_string())),
            "تخطى" => Ok(Token::Keyword("تخطى".to_string())),
            "دالة" => Ok(Token::Keyword("دالة".to_string())),
            "ارجع" => Ok(Token::Keyword("ارجع".to_string())),
            "ادع" => Ok(Token::Keyword("ادع".to_string())),
            "اقرأ" => Ok(Token::Keyword("اقرأ".to_string())),
            "اكتب" => Ok(Token::Keyword("اكتب".to_string())),
            "صحيح" => Ok(Token::Boolean(true)),
            "خطأ" => Ok(Token::Boolean(false)),
            _ => Ok(Token::Identifier(name)),
        }
    }

    fn read_operator(&mut self) -> Token {
        let op = match self.peek() {
            Some(&'+') => {
                self.consume();
                if let Some(&'=') = self.peek() {
                    self.consume();
                    "+=".to_string()
                } else {
                    "+".to_string()
                }
            }
            Some(&'-') => {
                self.consume();
                if let Some(&'=') = self.peek() {
                    self.consume();
                    "-=".to_string()
                } else {
                    "-".to_string()
                }
            }
            Some(&'*') => {
                self.consume();
                if let Some(&'=') = self.peek() {
                    self.consume();
                    "*=".to_string()
                } else {
                    "*".to_string()
                }
            }
            Some(&'/') => {
                self.consume();
                if let Some(&'=') = self.peek() {
                    self.consume();
                    "/=".to_string()
                } else {
                    "/".to_string()
                }
            }
            Some(&'%') => {
                self.consume();
                if let Some(&'=') = self.peek() {
                    self.consume();
                    "%=".to_string()
                } else {
                    "%".to_string()
                }
            }
            Some(&'=') => {
                self.consume();
                if let Some(&'=') = self.peek() {
                    self.consume();
                    "==".to_string()
                } else {
                    "=".to_string()
                }
            }
            Some(&'!') => {
                self.consume();
                if let Some(&'=') = self.peek() {
                    self.consume();
                    "!=".to_string()
                } else {
                    "!".to_string()
                }
            }
            Some(&'<') => {
                self.consume();
                if let Some(&'=') = self.peek() {
                    self.consume();
                    "<=".to_string()
                } else {
                    "<".to_string()
                }
            }
            Some(&'>') => {
                self.consume();
                if let Some(&'=') = self.peek() {
                    self.consume();
                    ">=".to_string()
                } else {
                    ">".to_string()
                }
            }
            _ => unreachable!(),
        };

        Token::Operator(op)
    }

    fn read_punctuation(&mut self) -> Token {
        let ch = self.consume();
        Token::Punctuation(ch.to_string())
    }
}

trait CharExt {
    fn is_arabic(&self) -> bool;
}

impl CharExt for char {
    fn is_arabic(&self) -> bool {
        matches!(self, '\u{0600}'..='\u{06FF}' | '\u{0750}'..='\u{077F}' | '\u{08A0}'..='\u{08FF}')
    }
}
