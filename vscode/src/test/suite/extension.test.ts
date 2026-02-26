import * as assert from 'assert';
import { RamzCompletionProvider } from '../../ramzCompletion';

suite('RamzCompletionProvider', () => {
    let provider: RamzCompletionProvider;

    setup(() => {
        provider = new RamzCompletionProvider();
    });

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

    test('should include Arabic descriptions', async () => {
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
        assert.ok(إذا.detail.includes('جملة شرطية'), 'Should include Arabic description');
    });

    test('should include English descriptions', async () => {
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

        const ifKeyword = items.find((item: any) => item.label === 'إذا');
        assert.ok(ifKeyword, 'Should include keyword "إذا"');
        assert.ok(ifKeyword.detail.includes('Conditional'), 'Should include English description');
    });
});