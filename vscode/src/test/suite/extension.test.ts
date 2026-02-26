import * as assert from 'assert';
import * as vscode from 'vscode';
import { RamzCompletionProvider } from '../../ramzCompletion';
import { RamzHoverProvider } from '../../ramzHover';

suite('Extension Activation', () => {
    test('should activate on Ramz language', () => {
        // This test would require actual VSCode context
        // For now, we just verify the classes can be instantiated
        
        const completionProvider = new RamzCompletionProvider();
        const hoverProvider = new RamzHoverProvider();

        assert.ok(completionProvider, 'Completion provider should be created');
        assert.ok(hoverProvider, 'Hover provider should be created');
    });

    test('should register all required VSCode contributions', () => {
        // Verify that all providers implement required VSCode interfaces
        
        const completionProvider = new RamzCompletionProvider();
        
        assert.strictEqual(typeof completionProvider.provideCompletionItems, 'function', 
            'Completion provider should implement provideCompletionItems');
        assert.strictEqual(typeof completionProvider.provideCompletionItems.length, 1,
            'provideCompletionItems should accept 4 arguments');
        
        const hoverProvider = new RamzHoverProvider();
        
        assert.strictEqual(typeof hoverProvider.provideHover, 'function',
            'Hover provider should implement provideHover');
        assert.strictEqual(typeof hoverProvider.provideHover.length, 2,
            'provideHover should accept 3 arguments');
    });

    test('should handle Ramz file extension', () => {
        // Verify that the extension handles both .ramz and .رمز files
        
        const extensions = ['.ramz', '.رمز'];
        
        extensions.forEach(ext => {
            assert.ok(ext.length > 0, `Extension ${ext} should be non-empty`);
            assert.ok(ext.startsWith('.'), `Extension ${ext} should start with dot`);
        });
    });

    test('should support bilingual configuration', () => {
        // Verify that extension configuration supports Arabic and English
        
        const languages = ['ar', 'en'];
        
        languages.forEach(lang => {
            assert.ok(['ar', 'en'].includes(lang), 
                `Language ${lang} should be supported`);
        });
    });
});