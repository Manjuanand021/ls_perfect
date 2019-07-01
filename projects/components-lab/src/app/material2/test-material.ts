import { Component, Optional } from '@angular/core';
//import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

@Component({
	selector: 'app',
	templateUrl: './test-material.html',
	styleUrls: ['./test-material.css'],
})
export class TestMaterial2AppComponent {
/*	
	isDarkTheme: boolean = false;
	lastDialogResult: string;

	foods: any[] = [
		{ name: 'Pizza', rating: 'Excellent' },
		{ name: 'Burritos', rating: 'Great' },
		{ name: 'French fries', rating: 'Pretty good' },
	];

	progress: number = 0;

	stringList: Array<{ label: string, value: string }> = [{ label: "Item a", value: "a" }, { label: "Item b", value: "b" }, { label: "Item c", value: "c" }];

	constructor(private _dialog: MdDialog, private _snackbar: MdSnackBar) {
		// Update the value for the progress-bar on an interval.
		setInterval(() => {
			this.progress = (this.progress + Math.floor(Math.random() * 4) + 1) % 100;
		}, 200);
	}

	openDialog() {
		let dialogRef = this._dialog.open(DialogContent);

		dialogRef.afterClosed().subscribe(result => {
			this.lastDialogResult = result;
		})
	}

	showSnackbar() {
		this._snackbar.open('YUM SNACKS', 'CHEW');
	}
*/	
}


@Component({
	templateUrl: './dialog-content.html'
})
export class DialogContent {
	stringList: Array<{ label: string, value: string }> = [
		{ label: "Item a", value: "a" }, { label: "Item b", value: "b" }, { label: "Item c", value: "c" },
		{ label: "Item d", value: "d" }, { label: "Item e", value: "e" }, { label: "Item f", value: "f" }
	];
	//constructor( @Optional() public dialogRef: MdDialogRef<DialogContent>) { }
}
