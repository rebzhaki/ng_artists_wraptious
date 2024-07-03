import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {isEmptyString} from "../common-functions";

@Injectable({
  providedIn: 'root',
})
export class UiService {
  constructor(private snackBar: MatSnackBar) {}

  toastConfig = ({
    configurations = {
      duration: 5000,
      verticalPosition: 'top',
    },
  }: {
    configurations?: MatSnackBarConfig;
  } = {}): MatSnackBarConfig => configurations;

  showToast(message: string, action = 'Close', config?: MatSnackBarConfig) {
    if (!isEmptyString(message)) {
      this.snackBar.open(
        message,
        action,
        config || {
          politeness: 'polite',
          duration: 86400000,
          verticalPosition: 'top',
          panelClass: ['snackbar-message'],
        }
      );
    }
  }
}
