import * as vscode from 'vscode';

/**
 * Mock VSCode Position for testing
 */
export class MockPosition implements vscode.Position {
    constructor(
        public line: number,
        public character: number
    ) {}

    translate(lineDelta: number, characterDelta: number): vscode.Position {
        return new MockPosition(
            this.line + lineDelta,
            this.character + characterDelta
        );
    }

    isBefore(other: vscode.Position): boolean {
        if (this.line < other.line) return true;
        if (this.line > other.line) return false;
        return this.character < other.character;
    }

    isAfter(other: vscode.Position): boolean {
        return this.isBefore(other);
    }
}