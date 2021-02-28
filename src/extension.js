const vscode = require('vscode');

let timerStatusBarItem = vscode.StatusBarItem;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = context.subscriptions.push(vscode.commands.registerCommand('niminy.timer', () => {
		timePicker().then(m => {

			timerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
			timerStatusBarItem.command = 'niminy.timer';
			context.subscriptions.push(timerStatusBarItem);

			context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(countDown(m)));
			context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(countDown(m)));
		});
	}));

	context.subscriptions.push(disposable);

}

function deactivate() {}

function countDown(m) {
	let seconds = m * 60;
	
	let x = setInterval(function() {
		seconds--;

		if (seconds < 0) {
		  clearInterval(x);
		  vscode.window.showInformationMessage('Time is over!');
		  timerStatusBarItem.hide();
		} else {
			let minute = Math.floor(seconds / 60);
			let second = seconds % 60;
			timerStatusBarItem.text = `$(watch) ${minute}:${second}`;
			timerStatusBarItem.show();
		}
	  }, 1000);
}

async function timePicker() {
	const minute = await vscode.window.showQuickPick(['20', '30', '40', '60', '120', '240'], {
		placeHolder: 'How many minutes would you like me to warn you later?',
	});

	vscode.window.showInformationMessage(`OK, I'll warn you in ${minute} minutes.`);

	return minute;
}


module.exports = {
	activate,
	deactivate
}
