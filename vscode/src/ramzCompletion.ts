import * as vscode from 'vscode';
import { KEYWORDS, getLanguage } from './utils/keywords';

export class RamzCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        const lang = getLanguage();
        const items: vscode.CompletionItem[] = [];

        // Add keyword completions
        KEYWORDS.forEach(keyword => {
            const item = new vscode.CompletionItem(
                keyword.arabic,
                this.getCompletionKind(keyword.category)
            );

            item.detail = lang === 'ar' 
                ? `${keyword.description_ar} (${keyword.english})`
                : `${keyword.description_en} (${keyword.english})`;

            item.documentation = new vscode.MarkdownString();
            item.documentation.appendMarkdown(
                lang === 'ar'
                    ? `**${keyword.arabic}** - ${keyword.description_ar}\n\n`
                    : `**${keyword.english}** - ${keyword.description_en}\n\n`
            );
            item.documentation.appendCodeblock(keyword.english, 'text');

            items.push(item);
        });

        return items;
    }

    private getCompletionKind(category: string): vscode.CompletionItemKind {
        switch (category) {
            case 'control':
                return vscode.CompletionItemKind.Keyword;
            case 'declaration':
                return vscode.CompletionItemKind.Keyword;
            case 'type':
                return vscode.CompletionItemKind.TypeParameter;
            case 'builtin':
                return vscode.CompletionItemKind.Function;
            case 'literal':
                return vscode.CompletionItemKind.Constant;
            default:
                return vscode.CompletionItemKind.Text;
        }
    }
}