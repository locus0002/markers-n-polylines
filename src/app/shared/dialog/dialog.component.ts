/**
 * @autor: Vladimir Aca
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  title: string;
  message: string;
  closeLabel: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: string, close: string }) {
    this.title = data.title;
    this.message = data.message;
    this.closeLabel = data.close;
  }

  ngOnInit(): void {
  }

}
