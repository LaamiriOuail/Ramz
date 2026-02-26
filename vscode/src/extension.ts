import * as vscode from 'vscode';
import { RamzCompletionProvider } from './ramzCompletion';
import { RamzHoverProvider } from './ramzHover';

export function activate(context: vscode.ExtensionContext) {
    console.log('Ramz Language Extension is now active!');

    // Register completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        'ramz',
        new RamzCompletionProvider(),
        ':', '(', '{', ' '
    );

    // Register hover provider
    const hoverProvider = vscode.languages.registerHoverProvider(
        'ramz',
        new RamzHoverProvider()
    );

    // Add to subscriptions
    context.subscriptions.push(
        completionProvider,
        hoverProvider
    );

    // Show welcome message
    vscode.window.showInformationMessage(
        'تم تفعيل دعم لغة رمز! Ramz Language Support activated!'
    );
}

export function deactivate() {
    console.log('Ramz Language Extension deactivated');
}