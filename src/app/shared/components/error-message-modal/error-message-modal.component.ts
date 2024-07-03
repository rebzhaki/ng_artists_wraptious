import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";
import {LowerCasePipe, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-error-message-modal',
  template: `
    <mat-dialog-content>
      <div class="error-title">
        @if (data?.isImageTooBig || data?.isImageTooSmall) {
          <h3>{{ data.error.main | titlecase }}</h3>
          <h5>{{ data.error.sub | lowercase }}px</h5>
        }

        @if (data?.isLoginError) {
          <h3>{{ data.error | titlecase }}</h3>
          <h5>{{ data.uiMessage | lowercase }}</h5>
        }
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button color="warn" mat-raised-button (click)="closeModal()">Close</button>
    </mat-dialog-actions>
  `,
  styleUrl: './error-message-modal.component.scss',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    LowerCasePipe,
    TitleCasePipe
  ],
  standalone: true
})
export class ErrorMessageModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorMessageModalComponent>,
    public breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.breakpointObserver.observe(Breakpoints.XSmall).subscribe((size) => {
      if (!size.matches) {
        dialogRef.updateSize('600px');
      } else {
        dialogRef.updateSize('89dvw');
      }
    });
  }

  closeModal(e?: any) {
    this.dialogRef.close({
      result: { ...this.data },
    });
  }
}
