use ramz::interpreter::Interpreter;
use ramz::lexer::Lexer;
use ramz::parser::Parser;

#[test]
fn test_hello_world() {
    let source = r#"
    اكتب("مرحبا بالعالم!")
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}

#[test]
fn test_variable_declaration_and_assignment() {
    let source = r#"
    متغير العمر = 10
    اكتب(العمر)
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}

#[test]
fn test_arithmetic_operations() {
    let source = r#"
    متغير أ = 10
    متغير ب = 5
    متغير مجموع = أ + ب
    متغير فرق = أ - ب
    متغير حاصل = أ * ب
    متغير قسمة = أ / ب
    متغير باقي = أ % ب
    اكتب(مجموع)
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}

#[test]
fn test_string_operations() {
    let source = r#"
    متغير الاسم = "أحمد"
    متغير التحية = "مرحبا"
    متغير الرسالة = التحية + " " + الاسم
    اكتب(الرسالة)
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}

#[test]
fn test_list_operations() {
    let source = r#"
    متغير الأرقام = [1, 2, 3, 4, 5]
    اكتب(الأرقام)
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}

#[test]
fn test_dictionary_operations() {
    let source = r#"
    متغير الطالب = {"الاسم": "محمد", "العمر": 12}
    اكتب(الطالب)
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}

#[test]
fn test_tuple_operations() {
    let source = r#"
    متغير زوج = (1, "أ", صحيح)
    اكتب(زوج)
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}

#[test]
fn test_boolean_values() {
    let source = r#"
    متغير ص = صحيح
    متغير خ = خطأ
    اكتب(ص)
    اكتب(خ)
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}

#[test]
fn test_float_operations() {
    let source = r#"
    متغير أ = 3.14
    متغير ب = 2.71
    متغير مجموع = أ + ب
    اكتب(مجموع)
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}

#[test]
fn test_reassignment() {
    let source = r#"
    متغير العمر = 10
    العمر = 20
    اكتب(العمر)
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}

#[test]
fn test_comparison_operations() {
    let source = r#"
    متغير أ = 10
    متغير ب = 5
    متغير أكبر = أ > ب
    متغير أصغر = أ < ب
    متغير يساوي = أ == ب
    اكتب(أكبر)
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}

#[test]
fn test_boolean_operations() {
    let source = r#"
    متغير أ = صحيح
    متغير ب = خطأ
    متغير و = أ و ب
    متغير أو = أ أو ب
    متغير عدم = !أ
    اكتب(و)
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}
