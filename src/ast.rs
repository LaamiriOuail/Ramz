use crate::types::{RamzType, RamzValue};

#[derive(Debug, Clone, PartialEq)]
pub enum Expr {
    Literal(RamzValue),
    Variable(String),
    BinaryOp {
        left: Box<Expr>,
        op: BinaryOperator,
        right: Box<Expr>,
    },
    UnaryOp {
        op: UnaryOperator,
        expr: Box<Expr>,
    },
    Call {
        name: String,
        args: Vec<Expr>,
    },
    List(Vec<Expr>),
    Dictionary(Vec<(String, Expr)>),
    Tuple(Vec<Expr>),
}

#[derive(Debug, Clone, PartialEq)]
pub enum BinaryOperator {
    Add,
    Subtract,
    Multiply,
    Divide,
    Modulo,
    Equal,
    NotEqual,
    LessThan,
    LessEqual,
    GreaterThan,
    GreaterEqual,
    And,
    Or,
}

#[derive(Debug, Clone, PartialEq)]
pub enum UnaryOperator {
    Not,
    Minus,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Statement {
    VariableDecl {
        name: String,
        type_annotation: Option<RamzType>,
        value: Expr,
    },
    Assignment {
        name: String,
        value: Expr,
    },
    FunctionCall {
        name: String,
        args: Vec<Expr>,
    },
    If {
        condition: Expr,
        then_stmt: Box<Statement>,
        else_stmt: Option<Box<Statement>>,
    },
    While {
        condition: Expr,
        body: Box<Statement>,
    },
    DoWhile {
        body: Box<Statement>,
        condition: Expr,
    },
    For {
        variable: String,
        start: Option<Expr>,
        end: Option<Expr>,
        step: Option<Expr>,
        iterable: Option<Expr>,
        body: Box<Statement>,
    },
    Block(Vec<Statement>),
    Break,
    Continue,
    NoOp,
}

#[derive(Debug, Clone)]
pub struct Program {
    pub statements: Vec<Statement>,
}
