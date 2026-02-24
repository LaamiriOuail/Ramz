use ramz::ast::*;
use ramz::lexer::Lexer;
use ramz::parser::Parser;
use ramz::types::{RamzType, RamzValue};

#[test]
fn test_variable_declaration() {
    let source = "متغير العمر = 10";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    assert_eq!(program.statements.len(), 1);
    match &program.statements[0] {
        Statement::VariableDecl {
            name,
            type_annotation,
            value,
        } => {
            assert_eq!(name, "العمر");
            assert!(type_annotation.is_none());
            assert!(matches!(value, Expr::Literal(RamzValue::Number(10))));
        }
        _ => panic!("Expected VariableDecl"),
    }
}

#[test]
fn test_variable_declaration_with_type() {
    let source = "متغير الاسم: نص = \"أحمد\"";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    assert_eq!(program.statements.len(), 1);
    match &program.statements[0] {
        Statement::VariableDecl {
            name,
            type_annotation,
            value,
        } => {
            assert_eq!(name, "الاسم");
            assert!(matches!(type_annotation, Some(RamzType::String)));
            assert!(matches!(value, Expr::Literal(RamzValue::String(_))));
        }
        _ => panic!("Expected VariableDecl"),
    }
}

#[test]
fn test_assignment() {
    let source = "العمر = 20";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    assert_eq!(program.statements.len(), 1);
    match &program.statements[0] {
        Statement::Assignment { name, value } => {
            assert_eq!(name, "العمر");
            assert!(matches!(value, Expr::Literal(RamzValue::Number(20))));
        }
        _ => panic!("Expected Assignment"),
    }
}

#[test]
fn test_binary_operations() {
    let source = "متغير الناتج = 10 + 5";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    assert_eq!(program.statements.len(), 1);
    match &program.statements[0] {
        Statement::VariableDecl { value, .. } => {
            if let Expr::BinaryOp { left, op, right } = value {
                assert!(matches!(**left, Expr::Literal(RamzValue::Number(10))));
                assert!(matches!(op, BinaryOperator::Add));
                assert!(matches!(**right, Expr::Literal(RamzValue::Number(5))));
            } else {
                panic!("Expected BinaryOp");
            }
        }
        _ => panic!("Expected VariableDecl"),
    }
}

#[test]
fn test_list_literal() {
    let source = "متغير الأرقام = [1, 2, 3]";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    assert_eq!(program.statements.len(), 1);
    match &program.statements[0] {
        Statement::VariableDecl { value, .. } => {
            if let Expr::List(items) = value {
                assert_eq!(items.len(), 3);
            } else {
                panic!("Expected List");
            }
        }
        _ => panic!("Expected VariableDecl"),
    }
}

#[test]
fn test_dictionary_literal() {
    let source = "متغير الطالب = {\"الاسم\": \"محمد\", \"العمر\": 12}";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    assert_eq!(program.statements.len(), 1);
    match &program.statements[0] {
        Statement::VariableDecl { value, .. } => {
            if let Expr::Dictionary(pairs) = value {
                assert_eq!(pairs.len(), 2);
            } else {
                panic!("Expected Dictionary");
            }
        }
        _ => panic!("Expected VariableDecl"),
    }
}

#[test]
fn test_tuple_literal() {
    let source = "متغير الزوج = (1, \"أ\", صحيح)";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    assert_eq!(program.statements.len(), 1);
    match &program.statements[0] {
        Statement::VariableDecl { value, .. } => {
            if let Expr::Tuple(items) = value {
                assert_eq!(items.len(), 3);
            } else {
                panic!("Expected Tuple");
            }
        }
        _ => panic!("Expected VariableDecl"),
    }
}

#[test]
fn test_function_call() {
    let source = "اكتب(\"مرحبا\")";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    assert_eq!(program.statements.len(), 1);
    match &program.statements[0] {
        Statement::FunctionCall { name, args } => {
            assert_eq!(name, "اكتب");
            assert_eq!(args.len(), 1);
        }
        _ => panic!("Expected FunctionCall"),
    }
}

#[test]
fn test_read_function() {
    let source = "متغير الاسم = اقرأ(\"ما اسمك؟ \")";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    assert_eq!(program.statements.len(), 1);
    match &program.statements[0] {
        Statement::VariableDecl { value, .. } => {
            if let Expr::Call { name, args } = value {
                assert_eq!(name, "اقرأ");
                assert_eq!(args.len(), 1);
            } else {
                panic!("Expected Call");
            }
        }
        _ => panic!("Expected VariableDecl"),
    }
}

#[test]
fn test_comparison() {
    let source = "متغير النتيجة = 10 > 5";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    assert_eq!(program.statements.len(), 1);
    match &program.statements[0] {
        Statement::VariableDecl { value, .. } => {
            if let Expr::BinaryOp { op, .. } = value {
                assert!(matches!(op, BinaryOperator::GreaterThan));
            } else {
                panic!("Expected BinaryOp");
            }
        }
        _ => panic!("Expected VariableDecl"),
    }
}

#[test]
fn test_string_concatenation() {
    let source = "متغير الرسالة = \"مرحبا\" + \" \" + \"العالم\"";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    assert_eq!(program.statements.len(), 1);
    match &program.statements[0] {
        Statement::VariableDecl { value, .. } => {
            if let Expr::BinaryOp { op, .. } = value {
                assert!(matches!(op, BinaryOperator::Add));
            } else {
                panic!("Expected BinaryOp");
            }
        }
        _ => panic!("Expected VariableDecl"),
    }
}
