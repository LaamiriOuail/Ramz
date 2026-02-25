# Ramz Programming Language - Agent Guide

This document provides coding guidelines and commands for working with the Ramz programming language project.

## Project Overview

Ramz is an Arabic programming language designed for teaching children programming. It's written in Rust and includes:
- Lexer for tokenizing Arabic keywords and syntax
- Parser for building an AST
- Interpreter for executing the code
- REPL environment for interactive programming

## Build/Test Commands

### Building the Project
```bash
# Debug build
cargo build

# Release build
cargo build --release

# Run the interpreter
cargo run

# Run with a file
cargo run program.ramz
```

### Testing
```bash
# Run all tests
cargo test

# Run a specific test file
cargo test --test lexer_test
cargo test --test parser_test
cargo test --test interpreter_test

# Run a specific test function
cargo test test_hello_world
cargo test test_variable_declaration

# Run tests with output
cargo test -- --nocapture

# Run tests for a specific module
cargo test lexer::
cargo test parser::
cargo test interpreter::
```

### Development Tools
```bash
# Check code without building
cargo check

# Format code
cargo fmt

# Run linter
cargo clippy

# Run clippy with all targets
cargo clippy --all-targets --all-features

# Generate documentation
cargo doc --open

# Run benchmarks (if using criterion)
cargo bench
```

## Code Style Guidelines

### Imports and Module Structure
- Use `mod` declarations in lib.rs and main.rs
- Re-export public APIs with `pub use` in lib.rs
- Keep imports organized: standard library first, then external crates, then local modules
- Example:
```rust
use std::collections::HashMap;
use std::io::{self, Write};

use thiserror::Error;

use crate::ast::*;
use crate::types::{RamzType, RamzValue};
```

### Naming Conventions
- **Types/Enums/Structs**: PascalCase (e.g., `RamzValue`, `LexerError`)
- **Functions/Methods**: snake_case (e.g., `tokenize`, `parse_statement`)
- **Variables**: snake_case (e.g., `line_number`, `token_list`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_RECURSION_DEPTH`)
- **File names**: snake_case (e.g., `interpreter.rs`, `lexer.rs`)

### Error Handling
- Use `thiserror` crate for custom error types
- Implement `From` traits for error conversion
- Provide clear Arabic error messages for user-facing errors
- Example:
```rust
#[derive(Error, Debug)]
pub enum InterpreterError {
    #[error("المتغير '{0}' غير معرف")]
    UndefinedVariable(String),
    #[error("نوع غير صالح: {0}")]
    TypeError(String),
}
```

### Structs and Enums
- Add `#[derive(Debug, Clone, PartialEq)]` for AST nodes
- Use `#[derive(Error, Debug)]` for error types
- Keep struct fields organized: public fields first, then private
- Use `pub` modifier explicitly for public fields

### Functions
- Keep functions focused and small (ideally under 50 lines)
- Use descriptive names in English for internal functions
- Use type annotations for public function signatures
- Return `Result<T, Error>` for operations that can fail
- Use `?` operator for error propagation

### Comments and Documentation
- Use `///` for public API documentation
- Use `//` for implementation comments
- Add examples in documentation for complex functions
- Keep comments concise and up-to-date

### Code Organization
- Each module should have a single responsibility
- Keep lexer, parser, and interpreter in separate modules
- Use helper functions to reduce code duplication
- Group related functionality together

### Testing
- Unit tests for individual functions
- Integration tests for complete programs
- Test both success and error cases
- Use descriptive test names
- Use Arabic text in test inputs where appropriate
- Example:
```rust
#[test]
fn test_variable_declaration() {
    let source = "متغير العمر = 10";
    // ... test implementation
}
```

### AST and Type System
- AST nodes should be immutable
- Use `Box<Expr>` for recursive enum variants
- Keep type information separate from AST structure
- Use `RamzValue` enum for runtime values

### Parser and Lexer
- Return `Result` types for error handling
- Include line/column information in error messages
- Handle all edge cases in tokenization
- Use peekable iterators for efficient parsing

### Interpreter
- Use environment scoping for variables
- Implement proper error propagation
- Handle type conversions explicitly
- Use `ExecuteFlag` enum for control flow

### Performance Considerations
- Avoid unnecessary allocations
- Use references instead of copies where possible
- Consider using `Cow<str>` for string handling
- Profile with `cargo flamegraph` if needed

### Git Conventions
- Use conventional commit messages
- Keep commits focused on single changes
- Write commit messages in English
- Examples: `feat: add loop support`, `fix: resolve parsing error for lists`

## Development Workflow

1. Create a new branch for features
2. Write tests first or alongside code
3. Run `cargo clippy` and `cargo fmt` before committing
4. Ensure all tests pass with `cargo test`
5. Keep PRs focused and well-documented