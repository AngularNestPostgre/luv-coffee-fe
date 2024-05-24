import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { Observable } from 'rxjs';

import { LoginDialogComponent } from '@auth/login-dialog/login-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  private readonly defaultDialogConfig: MatDialogConfig = {
    panelClass: 'ta-dialog',
    disableClose: true,
    minWidth: '320px',
    width: '320px',
  };

  constructor(private dialog: MatDialog) { }

  public login(inputData?: any): Observable<any> {
    return this.dialog.open(LoginDialogComponent, {
      data: inputData,
      ...this.defaultDialogConfig,
    })
    .afterClosed();
  }
}
