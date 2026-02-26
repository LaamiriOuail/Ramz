import * as vscode from 'vscode';

/**
 * Mock VSCode CancellationToken for testing
 */
export class MockCancellationToken implements vscode.CancellationToken {
    private _isCancelled = false;

    isCancellationRequested = false;

    onCancellationRequested(event: vscode.Event<any>): vscode.Disposable {
        // For testing purposes, cancellation is not implemented
        return {
            dispose: () => {}
        };
    }

    throwIfCancelled(): void {
        if (this._isCancelled) {
            throw new Error('Operation cancelled');
        }
    }
}