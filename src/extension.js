const vscode = require('vscode');

let myStatusBarItem = vscode.StatusBarItem;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "niminy" is now active!');

	let disposable = context.subscriptions.push(vscode.commands.registerCommand('niminy.helloWorld', () => {
		timePicker().then(m => {
			console.log(m);
			myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
			myStatusBarItem.command = 'niminy.helloWorld';
			context.subscriptions.push(myStatusBarItem);

			context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(countDown(m)));
			context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(countDown(m)));
		});
	}));

	context.subscriptions.push(disposable);
}

function deactivate() {}

function countDown(m) {
	let cd = m;
	
	let x = setInterval(function() {
		// Find the distance between now and the count down date
		cd--;
		// If the count down is finished, write some text
		if (cd < 0) {
		  clearInterval(x);
		  vscode.window.showInformationMessage(`Time is over!`);
		  myStatusBarItem.hide();
		} else {
			myStatusBarItem.text = `$(megaphone) ${cd} sec`;
			myStatusBarItem.show();
		}
	  }, 1000);
}

async function timePicker() {
	const result = await vscode.window.showQuickPick(['20', '30', '40', '60', '120'], {
		placeHolder: 'How many minutes would you like me to warn you later?',
	});

	vscode.window.showInformationMessage(`OK, I'll warn you in ${result} minutes.`);

	return result;
}


module.exports = {
	activate,
	deactivate
}
