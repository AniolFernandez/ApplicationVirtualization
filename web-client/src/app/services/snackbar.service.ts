import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarService {
    constructor(private snackBar: MatSnackBar){}

    private SNACKBAR_TIMEOUT=3000;
    
    public Show(message: string, permanent=false){
        if(permanent)
            this.snackBar.open(message, "Tancar");
        else
            this.snackBar.open(message, "Tancar", { duration: this.SNACKBAR_TIMEOUT });
    }
}