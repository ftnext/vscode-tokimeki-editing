// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const oshiRegex = /歩夢/g;

export class CodelensProvider implements vscode.CodeLensProvider {
  constructor() {}

  public provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    const codeLenses = [];

    const text = document.getText();

    const regex = new RegExp(oshiRegex);
    let matches;
    while ((matches = regex.exec(text)) !== null) {
      const line = document.lineAt(document.positionAt(matches.index).line);
      const indexOf = line.text.indexOf(matches[0]);
      const position = new vscode.Position(line.lineNumber, indexOf);
      const range = document.getWordRangeAtPosition(
        position,
        new RegExp(oshiRegex)
      );
      if (range) {
        const command = {
          title: "add oshi emoji",
          tooltip: "add oshi emoji",
          command: "tokimeki-editing.addOshiEmoji",
          arguments: [range],
        };
        codeLenses.push(new vscode.CodeLens(range, command));
      }
    }

    return codeLenses;
  }

  public resolveCodeLens(
    codeLens: vscode.CodeLens,
    token: vscode.CancellationToken
  ) {
    return codeLens;
  }
}

let disposables: vscode.Disposable[] = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "tokimeki-editing" is now active!'
  );

  const codelensProvider = new CodelensProvider();

  let codelensDisposable = vscode.languages.registerCodeLensProvider(
    { language: "markdown" },
    codelensProvider
  );
  disposables.push(codelensDisposable);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "tokimeki-editing.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from TOKIMEKI Editing🌈!"
      );
    }
  );

  context.subscriptions.push(disposable);

  vscode.commands.registerCommand(
    "tokimeki-editing.addOshiEmoji",
    (range: vscode.Range) => {
      if (vscode.window.activeTextEditor) {
        const text = vscode.window.activeTextEditor.document.getText(range);

        vscode.window.activeTextEditor.edit((editBuilder) => {
          editBuilder.replace(range, text + "🎀");
        });
      }
    }
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
