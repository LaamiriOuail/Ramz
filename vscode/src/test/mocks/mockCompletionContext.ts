/**
 * Mock VSCode CompletionContext for testing
 */
export class MockCompletionContext implements vscode.CompletionContext {
    triggerKind: vscode.CompletionTriggerKind = vscode.CompletionTriggerKind.Invoke;
    triggerCharacter: string | undefined = undefined;
}