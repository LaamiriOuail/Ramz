use ramz::lexer::Lexer;

fn main() {
    let source = "دالة عشو() {
    ارجع 42
}";
    let mut lexer = Lexer::new(source);
    match lexer.tokenize() {
        Ok(tokens) => {
            for token in tokens {
                println!("{:?}", token);
            }
        }
        Err(e) => println!("Error: {:?}", e),
    }
}
