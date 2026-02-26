import * as vscode from 'vscode';

/**
 * Mock VSCode TextDocument for testing
 */
export class MockTextDocument implements vscode.TextDocument {
    private _content: string = '';
    private _languageId: string = 'ramz';
    private _uri: vscode.Uri = vscode.Uri.file('test.ramz');

    constructor(content: string = '') {
        this._content = content;
    }

    getText(): string {
        return this._content;
    }

    get lineCount(): number {
        return this._content.split('\n').length;
    }

    lineAt(line: number): string {
        const lines = this._content.split('\n');
        return lines[line] || '';
    }

    get uri(): vscode.Uri {
        return this._uri;
    }

    get languageId(): string {
        return this._languageId;
    }
}

    getText(): string {
        return this._content;
    }

    get lineCount(): number {
        return this._lineCount;
    }

    lineAt(line: number): string {
        const lines = this._content.split('\n');
        return lines[line] || '';
    }

    offsetAt(offset: number): vscode.Position {
        let currentOffset = 0;
        let line = 0;
        let character = 0;

        while (currentOffset < offset && line < this._lineCount) {
            const lineText = this.lineAt(line);
            const lineLength = lineText.length + 1; // +1 for newline

            if (currentOffset + lineLength >= offset) {
                character = offset - currentOffset;
                break;
            }

            currentOffset += lineLength;
            line++;
        }

        return new vscode.Position(line, character);
    }

    getWordRangeAtPosition(position: vscode.Position): vscode.Range {
        const lineText = this.lineAt(position.line);
        const lineStart = this.offsetAt(position.line);
        const positionOffset = lineStart + position.character;

        // Find word start (go backwards until we hit a non-word character)
        let start = position.character;
        while (start > 0 && /\w/.test(lineText[start - 1])) {
            start--;
        }

        // Find word end (go forward until we hit a non-word character)
        let end = position.character;
        while (end < lineText.length && /\w/.test(lineText[end])) {
            end++;
        }

        return new vscode.Range(
            new vscode.Position(position.line, start),
            new vscode.Position(position.line, end)
        );
    }

    positionAt(offset: number): vscode.Position {
        let currentOffset = 0;
        let line = 0;
        let character = 0;

        while (currentOffset < offset && line < this._lineCount) {
            const lineText = this.lineAt(line);
            const lineLength = lineText.length + 1; // +1 for newline

            if (currentOffset + lineLength >= offset) {
                character = offset - currentOffset;
                break;
            }

            currentOffset += lineLength;
            line++;
        }

        return new vscode.Position(line, character);
    }

    get uri(): vscode.Uri {
        return this._uri;
    }

    get languageId(): string {
        return this._languageId;
    }
}