use ramz::lexer::{Lexer, Token};

#[test]
fn test_keywords() {
    let source = "متغير رقم عشري نص منطقية قائمة قاموس زوج إذا وإلا كرر لكل اقرأ اكتب";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();

    assert!(matches!(tokens[0], Token::Keyword(ref s) if s == "متغير"));
    assert!(matches!(tokens[1], Token::Keyword(ref s) if s == "رقم"));
    assert!(matches!(tokens[2], Token::Keyword(ref s) if s == "عشري"));
    assert!(matches!(tokens[3], Token::Keyword(ref s) if s == "نص"));
    assert!(matches!(tokens[4], Token::Keyword(ref s) if s == "منطقية"));
    assert!(matches!(tokens[5], Token::Keyword(ref s) if s == "قائمة"));
    assert!(matches!(tokens[6], Token::Keyword(ref s) if s == "قاموس"));
    assert!(matches!(tokens[7], Token::Identifier(ref s) if s == "زوج"));
    assert!(matches!(tokens[8], Token::Keyword(ref s) if s == "إذا"));
    assert!(matches!(tokens[9], Token::Keyword(ref s) if s == "وإلا"));
    assert!(matches!(tokens[10], Token::Keyword(ref s) if s == "كرر"));
    assert!(matches!(tokens[11], Token::Keyword(ref s) if s == "لكل"));
    assert!(matches!(tokens[12], Token::Keyword(ref s) if s == "اقرأ"));
    assert!(matches!(tokens[13], Token::Keyword(ref s) if s == "اكتب"));
}

#[test]
fn test_numbers() {
    let source = "42 3.14 100 0.5";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();

    assert!(matches!(tokens[0], Token::Number(42)));
    assert!(matches!(tokens[1], Token::Float(f) if (f - 3.14).abs() < 0.001));
    assert!(matches!(tokens[2], Token::Number(100)));
    assert!(matches!(tokens[3], Token::Float(f) if (f - 0.5).abs() < 0.001));
}

#[test]
fn test_strings() {
    let source = "\"مرحبا\" \"Hello World\" \"\" ";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();

    assert!(matches!(tokens[0], Token::String(ref s) if s == "مرحبا"));
    assert!(matches!(tokens[1], Token::String(ref s) if s == "Hello World"));
    assert!(matches!(tokens[2], Token::String(ref s) if s.is_empty()));
}

#[test]
fn test_booleans() {
    let source = "صحيح خطأ";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();

    assert!(matches!(tokens[0], Token::Boolean(true)));
    assert!(matches!(tokens[1], Token::Boolean(false)));
}

#[test]
fn test_identifiers() {
    let source = "اسم المتغير العمر";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();

    assert!(matches!(tokens[0], Token::Identifier(ref s) if s == "اسم"));
    assert!(matches!(tokens[1], Token::Identifier(ref s) if s == "المتغير"));
    assert!(matches!(tokens[2], Token::Identifier(ref s) if s == "العمر"));
}

#[test]
fn test_operators() {
    let source = "+ - * / % = == != < <= > >= !";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();

    assert!(matches!(tokens[0], Token::Operator(ref s) if s == "+"));
    assert!(matches!(tokens[1], Token::Operator(ref s) if s == "-"));
    assert!(matches!(tokens[2], Token::Operator(ref s) if s == "*"));
    assert!(matches!(tokens[3], Token::Operator(ref s) if s == "/"));
    assert!(matches!(tokens[4], Token::Operator(ref s) if s == "%"));
    assert!(matches!(tokens[5], Token::Operator(ref s) if s == "="));
    assert!(matches!(tokens[6], Token::Operator(ref s) if s == "=="));
    assert!(matches!(tokens[7], Token::Operator(ref s) if s == "!="));
    assert!(matches!(tokens[8], Token::Operator(ref s) if s == "<"));
    assert!(matches!(tokens[9], Token::Operator(ref s) if s == "<="));
    assert!(matches!(tokens[10], Token::Operator(ref s) if s == ">"));
    assert!(matches!(tokens[11], Token::Operator(ref s) if s == ">="));
    assert!(matches!(tokens[12], Token::Operator(ref s) if s == "!"));
}

#[test]
fn test_punctuation() {
    let source = "[ ] { } ( ) , :";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();

    assert!(matches!(tokens[0], Token::Punctuation(ref s) if s == "["));
    assert!(matches!(tokens[1], Token::Punctuation(ref s) if s == "]"));
    assert!(matches!(tokens[2], Token::Punctuation(ref s) if s == "{"));
    assert!(matches!(tokens[3], Token::Punctuation(ref s) if s == "}"));
    assert!(matches!(tokens[4], Token::Punctuation(ref s) if s == "("));
    assert!(matches!(tokens[5], Token::Punctuation(ref s) if s == ")"));
    assert!(matches!(tokens[6], Token::Punctuation(ref s) if s == ","));
    assert!(matches!(tokens[7], Token::Punctuation(ref s) if s == ":"));
}

#[test]
fn test_comments() {
    let source = "# هذا تعليق\nمتغير العمر = 10";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();

    assert!(matches!(tokens[0], Token::Keyword(ref s) if s == "متغير"));
    assert!(matches!(tokens[1], Token::Identifier(ref s) if s == "العمر"));
}

#[test]
fn test_whitespace_handling() {
    let source = "  متغير  اسم  =  \"أحمد\"  ";
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();

    assert!(matches!(tokens[0], Token::Keyword(ref s) if s == "متغير"));
    assert!(matches!(tokens[1], Token::Identifier(ref s) if s == "اسم"));
    assert!(matches!(tokens[2], Token::Operator(ref s) if s == "="));
    assert!(matches!(tokens[3], Token::String(ref s) if s == "أحمد"));
}
