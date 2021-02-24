/**
 * @autor: Vladimir Aca
 */

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.css']
})
export class PromptComponent{
  externalId: number;
  constructor(
    public dialogRef: MatDialogRef<PromptComponent>) { }

  cancel() {
    this.dialogRef.close();
  }

}
