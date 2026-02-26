import * as vscode from 'vscode';
import { MockPosition } from './mockPosition';

/**
 * Mock VSCode Range for testing
 */
export class MockRange implements vscode.Range {
    constructor(
        public start: vscode.Position,
        public end: vscode.Position
    ) {}

    contains(position: vscode.Position): boolean {
        return this.start.isBefore(position) && this.end.isAfter(position);
    }

    isEqual(other: vscode.Range): boolean {
        return this.start.line === other.start.line &&
               this.start.character === other.start.character &&
               this.end.line === other.end.line &&
               this.end.character === other.end.character;
    }
}