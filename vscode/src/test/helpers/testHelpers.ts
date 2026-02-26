import * as vscode from 'vscode';
import { MockTextDocument } from '../mocks';

/**
 * Test helper utilities
 */

/**
 * Create a mock TextDocument with given content
 */
export function createMockDocument(content: string = ''): vscode.TextDocument {
    return new MockTextDocument(content);
}

/**
 * Create a mock Position at given line and character
 */
export function createMockPosition(line: number, character: number): vscode.Position {
    return { line, character };
}

/**
 * Create a mock Range from start and end positions
 */
export function createMockRange(startLine: number, startChar: number, endLine: number, endChar: number): vscode.Range {
    return {
        start: createMockPosition(startLine, startChar),
        end: createMockPosition(endLine, endChar)
    };
}

/**
 * Get word at a specific position in a document
 */
export function getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string {
    const lineText = document.lineAt(position.line);
    const lineStart = 0;
    
    // Simple word boundary detection (spaces, operators, punctuation)
    let start = position.character;
    while (start > lineStart && /\s/.test(lineText[start - 1])) {
        start--;
    }
    
    let end = position.character;
    while (end < lineText.length && /\w/.test(lineText[end])) {
        end++;
    }
    
    return lineText.substring(start, end);
}

/**
 * Get the current line text at a position
 */
export function getLineAtPosition(document: vscode.TextDocument, position: vscode.Position): string {
    return document.lineAt(position.line);
}

/**
 * Wait for a specified number of milliseconds
 */
export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Assert that markdown string contains specific text
 */
export function assertMarkdownContains(markdown: vscode.MarkdownString, text: string): void {
    const markdownText = markdown.value;
    if (!markdownText.includes(text)) {
        throw new Error(`Expected markdown to contain "${text}", but got: ${markdownText}`);
    }
}

/**
 * Assert that markdown string contains multiple texts
 */
export function assertMarkdownContainsAll(markdown: vscode.MarkdownString, texts: string[]): void {
    texts.forEach(text => assertMarkdownContains(markdown, text));
}

/**
 * Create a mock Position at given line and character
 */
export function createMockPosition(line: number, character: number): vscode.Position {
    return new MockPosition(line, character);
}

/**
 * Create a mock Range with given positions
 */
export function createMockRange(startLine: number, startChar: number, endLine: number, endChar: number): vscode.Range {
    return new MockRange(
        createMockPosition(startLine, startChar),
        createMockPosition(endLine, endChar)
    );
}

/**
 * Create a mock Range from position to end of line
 */
export function createMockRangeFromPosition(position: vscode.Position): vscode.Range {
    const endPosition = createMockPosition(position.line, Infinity);
    return new MockRange(position, endPosition);
}

/**
 * Wait for a specified number of milliseconds
 */
export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Assert that markdown string contains specific text
 */
export function assertMarkdownContains(markdown: vscode.MarkdownString, text: string): void {
    const markdownText = markdown.value;
    if (!markdownText.includes(text)) {
        throw new Error(`Expected markdown to contain "${text}", but got: ${markdownText}`);
    }
}

/**
 * Assert that markdown string contains multiple texts
 */
export function assertMarkdownContainsAll(markdown: vscode.MarkdownString, texts: string[]): void {
    texts.forEach(text => assertMarkdownContains(markdown, text));
}

/**
 * Get word at a specific position in a document
 */
export function getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string {
    const range = document.getWordRangeAtPosition(position);
    return document.getText(range);
}

/**
 * Get the current line text at a position
 */
export function getLineAtPosition(document: vscode.TextDocument, position: vscode.Position): string {
    return document.lineAt(position.line);
}