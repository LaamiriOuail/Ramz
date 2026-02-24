use ramz::interpreter::Interpreter;
use ramz::lexer::Lexer;
use ramz::parser::Parser;

#[test]
fn test_while_loop_basic() {
    let source = r#"
    متغير عد = 1
    كرر عد <= 3 {
        اكتب(عد)
        عد = عد + 1
    }
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
fn test_for_each_loop() {
    let source = r#"
    متغير الفواكه = ["تفاح", "موز", "برتقال"]
    لكل فاكهة في الفواكه {
        اكتب("أحب " + فاكهة)
    }
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
fn test_for_range_loop() {
    let source = r#"
    لكل i من 1 إلى 3 {
        اكتب("العدد: " + i)
    }
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
fn test_for_range_with_step() {
    let source = r#"
    لكل i من 1 إلى 10 خطوة 2 {
        اكتب(i)
    }
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
fn test_backward_range() {
    let source = r#"
    لكل i من 5 إلى 1 خطوة -1 {
        اكتب(i)
    }
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
fn test_do_while_loop() {
    let source = r#"
    متغير عد = 1
    افعل {
        اكتب("العدد: " + عد)
        عد = عد + 1
    } طالما عد <= 3
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
fn test_block_syntax() {
    let source = r#"
    اكتب("البداية")
    {
        اكتب("داخل")
        اكتب("الكتلة")
    }
    اكتب("النهاية")
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
fn test_break_in_while() {
    let source = r#"
    متغير i = 1
    كرر صحيح {
        اكتب(i)
        إذا i == 3:
            اوقف
        i = i + 1
    }
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
fn test_break_in_for() {
    let source = r#"
    لكل i من 1 إلى 10 {
        إذا i == 4 {
            اوقف
        }
        اكتب(i)
    }
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
fn test_continue_in_for() {
    let source = r#"
    لكل i من 1 إلى 5 {
        إذا i == 3:
            تخطى
        اكتب(i)
    }
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
fn test_continue_in_while() {
    let source = r#"
    متغير i = 1
    كرر i <= 5 {
        إذا i == 3:
            تخطى
        اكتب(i)
        i = i + 1
    }
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
fn test_nested_loops() {
    let source = r#"
    لكل i من 1 إلى 3 {
        اكتب("i=" + i)
        لكل j من 1 إلى 2 {
            اكتب("  j=" + j)
        }
    }
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
fn test_break_in_nested_loops() {
    let source = r#"
    لكل i من 1 إلى 3 {
        اكتب("i=" + i)
        لكل j من 1 إلى 10 {
            إذا j == 2:
                اوقف
            اكتب("  j=" + j)
        }
    }
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
fn test_tuple_iteration() {
    let source = r#"
    لكل قيمة في (1, 2, 3) {
        اكتب("القيمة: " + قيمة)
    }
    "#;

    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize().unwrap();
    let mut parser = Parser::new(tokens);
    let program = parser.parse().unwrap();

    let mut interpreter = Interpreter::new();
    let result = interpreter.interpret(&program);

    assert!(result.is_ok());
}
