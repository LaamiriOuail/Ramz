import * as assert from 'assert';
import { RamzHoverProvider } from '../../ramzHover';
import * as vscode from 'vscode';

suite('RamzHoverProvider', () => {
    let provider: RamzHoverProvider;

    setup(() => {
        provider = new RamzHoverProvider();
    });

    // ============================================
    // Tests 1-5: Basic Hover Functionality
    // ============================================

    test('should return hover for Arabic keyword "إذا"', async () => {
        const mockDocument = {
            getText: () => 'إذا العمر >= 18',
            getWordRangeAtPosition: () => ({ getText: () => 'إذا' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover, 'Should return hover for "إذا" keyword');
        assert.strictEqual(hover.contents.length, 2, 'Should have 2 markdown sections (Arabic + English)');
    });

    test('should return hover for Arabic keyword "متغير"', async () => {
        const mockDocument = {
            getText: () => 'متغير الاسم',
            getWordRangeAtPosition: () => ({ getText: () => 'متغير' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover, 'Should return hover for "متغير" keyword');
    });

    test('should return hover for Arabic keyword "دالة"', async () => {
        const mockDocument = {
            getText: () => 'دالة مرحبا',
            getWordRangeAtPosition: () => ({ getText: () => 'دالة' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover, 'Should return hover for "دالة" keyword');
    });

    // ============================================
    // Tests 6-10: Bilingual Content
    // ============================================

    test('should include Arabic description in hover for "إذا"', async () => {
        const mockDocument = {
            getText: () => 'إذا',
            getWordRangeAtPosition: () => ({ getText: () => 'إذا' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover);
        assert.ok(hover.contents.some(md => md.includes('جملة شرطية')), 'Should include Arabic description "جملة شرطية"');
    });

    test('should include English description in hover for "إذا"', async () => {
        const mockDocument = {
            getText: () => 'if',
            getWordRangeAtPosition: () => ({ getText: () => 'if' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover);
        assert.ok(hover.contents.some(md => md.includes('Conditional')), 'Should include English description "Conditional"');
    });

    test('should include code example in hover for "إذا"', async () => {
        const mockDocument = {
            getText: () => 'إذا',
            getWordRangeAtPosition: () => ({ getText: () => 'إذا' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover);
        assert.ok(hover.contents.some(md => md.includes('إذا العمر >= 18:')), 'Should include code example');
    });

    // ============================================
    // Tests 11-13: Markdown Formatting
    // ============================================

    test('should format hover with markdown headers', async () => {
        const mockDocument = {
            getText: () => 'دالة',
            getWordRangeAtPosition: () => ({ getText: () => 'دالة' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover);
        assert.ok(hover.contents.some(md => md.includes('**')), 'Should include bold formatting with **');
    });

    test('should include code blocks in markdown', async () => {
        const mockDocument = {
            getText: () => 'اكتب',
            getWordRangeAtPosition: () => ({ getText: () => 'اكتب' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover);
        assert.ok(hover.contents.some(md => md.includes('ramz')), 'Should include code blocks with language');
    });

    // ============================================
    // Tests 14-16: Edge Cases
    // ============================================

    test('should return undefined for non-keyword', async () => {
        const mockDocument = {
            getText: () => 'hello',
            getWordRangeAtPosition: () => ({ getText: () => 'hello' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.strictEqual(hover, undefined, 'Should return undefined for non-keyword');
    });

    test('should return undefined for empty word', async () => {
        const mockDocument = {
            getText: () => '',
            getWordRangeAtPosition: () => ({ getText: () => '' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.strictEqual(hover, undefined, 'Should return undefined for empty word');
    });

    test('should handle position at end of document', async () => {
        const mockDocument = {
            getText: () => 'إذا true',
            getWordRangeAtPosition: () => ({ getText: () => 'true' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 5 } as any,
            undefined as any
        );

        assert.ok(hover, 'Should handle end-of-document position');
    });

    test('should handle position at start of document', async () => {
        const mockDocument = {
            getText: () => 'متغير x = 10',
            getWordRangeAtPosition: () => ({ getText: () => 'متغير' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover, 'Should handle start-of-document position');
    });

    // ============================================
    // Tests 17-18: Hover on English Keywords
    // ============================================

    test('should provide hover for English keyword "if"', async () => {
        const mockDocument = {
            getText: () => 'if',
            getWordRangeAtPosition: () => ({ getText: () => 'if' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover);
        assert.ok(hover.contents.some(md => md.includes('إذا')), 'Should show Arabic keyword "إذا" even for English input');
        assert.ok(hover.contents.some(md => md.includes('if')), 'Should show English keyword "if"');
    });

    test('should provide bilingual hover for English "var"', async () => {
        const mockDocument = {
            getText: () => 'var',
            getWordRangeAtPosition: () => ({ getText: () => 'var' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover);
        assert.ok(hover.contents.some(md => md.includes('متغير')), 'Should show Arabic keyword "متغير"');
        assert.ok(hover.contents.some(md => md.includes('var')), 'Should show English keyword "var"');
    });

    // ============================================
    // Tests 19-20: Comprehensive Hover Content
    // ============================================

    test('should provide complete hover with all sections for "دالة"', async () => {
        const mockDocument = {
            getText: () => 'دالة',
            getWordRangeAtPosition: () => ({ getText: () => 'دالة' }),
            uri: { toString: () => 'test.ramz' }
        } as any;

        const hover = await provider.provideHover(
            mockDocument,
            { line: 0, character: 0 } as any,
            undefined as any
        );

        assert.ok(hover);
        assert.ok(hover.contents.length >= 2, 'Should have at least 2 markdown sections (title + code)');
        assert.ok(hover.contents.some(md => md.includes('**')), 'Should have bold formatting');
        assert.ok(hover.contents.some(md => md.includes('ramz')), 'Should have code block');
    });
});