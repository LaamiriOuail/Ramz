import * as assert from 'assert';
import { RamzCompletionProvider } from '../../ramzCompletion';

suite('RamzCompletionProvider', () => {
    let provider: RamzCompletionProvider;

    setup(() => {
        provider = new RamzCompletionProvider();
    });

    // ============================================
    // Tests 1-5: Basic Keyword Coverage
    // ============================================
    
    test('should provide all 24 keywords', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.strictEqual(items.length, 24, 'Should provide 24 keyword completions');
    });

    test('should include Arabic keyword "إذا" (if)', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const إذا = items.find((item: any) => item.label === 'إذا');
        assert.ok(إذا, 'Should include Arabic keyword "إذا"');
    });

    test('should include Arabic keyword "وإلا" (else)', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const و = items.find((item: any) => item.label === 'وإلا');
        assert.ok(و, 'Should include Arabic keyword "وإلا"');
    });

    test('should include Arabic keyword "متغير" (var)', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const متغير = items.find((item: any) => item.label === 'متغير');
        assert.ok(متغير, 'Should include Arabic keyword "متغير"');
    });

    test('should include Arabic keyword "دالة" (function)', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const دالة = items.find((item: any) => item.label === 'دالة');
        assert.ok(دالة, 'Should include Arabic keyword "دالة"');
    });

    test('should include Arabic keyword "كرر" (while)', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const كرر = items.find((item: any) => item.label === 'كرر');
        assert.ok(كرر, 'Should include Arabic keyword "كرر"');
    });

    // ============================================
    // Tests 6-10: Bilingual Descriptions
    // ============================================

    test('should include Arabic description for "إذا"', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const إذا = items.find((item: any) => item.label === 'إذا');
        assert.ok(إذا.detail.includes('جملة شرطية'), 'Should include Arabic description');
    });

    test('should include English description for "إذا"', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const إذا = items.find((item: any) => item.label === 'إذا');
        assert.ok(إذا.detail.includes('Conditional'), 'Should include English description');
    });

    test('should include Arabic description for "وإلا"', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const و = items.find((item: any) => item.label === 'وإلا');
        assert.ok(و.detail.includes('الجملة البديلة'), 'Should include Arabic description');
    });

    test('should include English description for "وإلا"', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const و = items.find((item: any) => item.label === 'وإلا');
        assert.ok(و.detail.includes('Alternative clause'), 'Should include English description');
    });

    // ============================================
    // Tests 11-15: Completion Item Kind
    // ============================================

    test('should return Keyword kind for control keywords', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const إذا = items.find((item: any) => item.label === 'إذا');
        assert.strictEqual(إذا.kind, vscode.CompletionItemKind.Keyword, 'Control keywords should have Keyword kind');
    });

    test('should return Keyword kind for declaration keywords', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const متغير = items.find((item: any) => item.label === 'متغير');
        assert.strictEqual(متغير.kind, vscode.CompletionItemKind.Keyword, 'Declaration keywords should have Keyword kind');
    });

    test('should return TypeParameter kind for type keywords', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const رقم = items.find((item: any) => item.label === 'رقم');
        assert.strictEqual(رقم.kind, vscode.CompletionItemKind.TypeParameter, 'Type keywords should have TypeParameter kind');
    });

    test('should return Function kind for builtin keywords', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const ادع = items.find((item: any) => item.label === 'ادع');
        assert.strictEqual(ادع.kind, vscode.CompletionItemKind.Function, 'Builtin keywords should have Function kind');
    });

    test('should return Constant kind for literal keywords', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        const صحيح = items.find((item: any) => item.label === 'صحيح');
        assert.strictEqual(صحيح.kind, vscode.CompletionItemKind.Constant, 'Literal keywords should have Constant kind');
    });

    // ============================================
    // Tests 16-20: Edge Cases
    // ============================================

    test('should handle empty document', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.strictEqual(items.length, 24, 'Should provide all keywords even for empty document');
    });

    test('should handle document with only whitespace', async () => {
        const mockDocument = {
            getText: () => '   \n   ',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.strictEqual(items.length, 24, 'Should provide all keywords for whitespace document');
    });

    test('should handle document with comments', async () => {
        const mockDocument = {
            getText: () => '# هذا تعليق\nمتغير x = 10\n',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.strictEqual(items.length, 24, 'Should provide all keywords for document with comments');
    });

    test('should handle mixed RTL/LTR text', async () => {
        const mockDocument = {
            getText: () => 'متغير العمر = 25\nاكتب("Hello")',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const items = await provider.provideCompletionItems(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.strictEqual(items.length, 24, 'Should handle mixed RTL/LTR text correctly');
    });
});