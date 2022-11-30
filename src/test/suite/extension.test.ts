import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

const sleep = (ms: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

const testFileLocation = '/markdown/example.md';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	let fileUri: vscode.Uri;
	let editor: vscode.TextEditor;

	setup(async () => {
		fileUri = vscode.Uri.file(vscode.workspace.workspaceFolders![0].uri.fsPath + testFileLocation);
		const document = await vscode.workspace.openTextDocument(fileUri);
		editor = await vscode.window.showTextDocument(document);
	});

	test('Count CodeLenses', async () => {
		// ref: https://github.com/microsoft/vscode/blob/1.73.1/extensions/typescript-language-features/src/test/smoke/referencesCodeLens.test.ts#L105-L107
		await sleep(500);
		const codeLenses = await vscode.commands.executeCommand<readonly vscode.CodeLens[]>('vscode.executeCodeLensProvider', fileUri, 100);
		
		assert.strictEqual(codeLenses?.length, 2);
		assert.strictEqual(codeLenses?.[0].range.start.line, 2);
		assert.strictEqual(codeLenses?.[1].range.start.line, 4);
	});

	test('Insert 🎀 after 歩夢', async () => {
		const COMMAND_NAME = "tokimeki-editing.addOshiEmoji";
		await sleep(1500);  // load 'add oshi emoji' (but do not invoke from the tooltip)
		await vscode.commands.executeCommand(COMMAND_NAME, new vscode.Range(new vscode.Position(4, 0), new vscode.Position(4, 2)));
		await sleep(500);

		const actual = editor.document.lineAt(4).text;
		assert.strictEqual(actual, '歩夢🎀の行にemojiを追加できる');
	});

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
