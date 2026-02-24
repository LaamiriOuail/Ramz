mod ast;
mod interpreter;
mod lexer;
mod parser;
mod types;

use interpreter::Interpreter;
use lexer::Lexer;
use parser::Parser;
use rustyline::error::ReadlineError;
use rustyline::Editor;

fn run(source: &str) -> Result<(), Box<dyn std::error::Error>> {
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize()?;

    let mut parser = Parser::new(tokens);
    let program = parser.parse()?;

    let mut interpreter = Interpreter::new();
    interpreter.interpret(&program)?;

    Ok(())
}

fn run_repl() -> Result<(), Box<dyn std::error::Error>> {
    let mut rl = Editor::<()>::new()?;
    let hist_file = ".ramz_history";

    if let Err(_) = rl.load_history(hist_file) {}

    println!("مرحباً بك في رمز! اكتب 'خروج' للإنهاء.");
    println!("مرحباً بك في Ramz! اكتب 'exit' للخروج.");
    println!("Type 'exit' to quit the REPL.");

    loop {
        let readline = rl.readline("رمز >> ");

        match readline {
            Ok(line) => {
                rl.add_history_entry(line.as_str());

                let trimmed = line.trim();
                if trimmed == "خروج" || trimmed == "exit" {
                    break;
                }

                if trimmed.is_empty() {
                    continue;
                }

                match run(trimmed) {
                    Ok(()) => {}
                    Err(e) => println!("خطأ: {}", e),
                }
            }
            Err(ReadlineError::Interrupted) => {
                println!("CTRL-C");
                break;
            }
            Err(ReadlineError::Eof) => {
                println!("CTRL-D");
                break;
            }
            Err(err) => {
                println!("خطأ: {}", err);
                break;
            }
        }
    }

    rl.save_history(hist_file)?;
    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = std::env::args().collect();

    if args.len() > 1 {
        let filename = &args[1];
        let source = std::fs::read_to_string(filename)?;
        run(&source)?;
    } else {
        run_repl()?;
    }

    Ok(())
}
