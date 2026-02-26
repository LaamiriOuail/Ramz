import * as vscode from 'vscode';
import { KEYWORDS, getLanguage } from './utils/keywords';

export class RamzHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover | undefined> {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range).trim();
        const lang = getLanguage();

        // Find matching keyword
        const keyword = KEYWORDS.find(k => k.arabic === word || k.english === word);

        if (keyword) {
            const markdown = new vscode.MarkdownString();

            if (lang === 'ar') {
                markdown.appendMarkdown(`**${keyword.arabic}** (${keyword.english})\n\n`);
                markdown.appendMarkdown(`**${keyword.description_ar}**\n\n`);
            } else {
                markdown.appendMarkdown(`**${keyword.english}** (${keyword.arabic})\n\n`);
                markdown.appendMarkdown(`**${keyword.description_en}**\n\n`);
            }

            // Add examples
            markdown.appendMarkdown(`### Examples\n\n`);
            markdown.appendCodeblock('ramz', this.getExampleCode(keyword));

            return new vscode.Hover(markdown);
        }

        return undefined;
    }

    private getExampleCode(keyword: { arabic: string; english: string }): string {
        const examples: Record<string, string> = {
            'إذا': `إذا العمر >= 18:\n    اكتب("أنت بالغ")`,
            'وإلا': `إذا العمر >= 18:\n    اكتب("أنت بالغ")\nوإلا:\n    اكتب("أنت قاصر")`,
            'كرر': `متغير عد = 0\nكرر عد < 5:\n    اكتب(عد)\n    عد = عد + 1`,
            'لكل': `لكل i من 1 إلى 10:\n    اكتب(i)`,
            'دالة': `دالة مرحبا() {\n    اكتب("مرحباً!")\n}`,
            'متغير': `متغير الاسم = "أحمد"`,
            'اكتب': `اكتب("مرحباً بالعالم!")`,
            'اقرأ': `متغير الاسم = اقرأ("ما اسمك؟ ")`
        };

        return examples[keyword.english] || `# ${keyword.arabic} example`;
    }
}