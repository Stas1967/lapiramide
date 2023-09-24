import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { fireAuth } from 'src/app/app.module';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  aut = fireAuth;
  constructor(public dialog: MatDialog) {
    onAuthStateChanged(this.aut, (user) => {
      console.log(user);
    })
  }

  openDialog(): void {
    this.dialog.open(NewUser)
  }

}

@Component({
  selector: 'app-newusers',
  templateUrl: './newuser.html',
  standalone: true,
  styleUrls: ['./users.component.css'],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, NgFor,
    MatIconModule, MatSelectModule, MatDialogModule, MatButtonModule, MatTableModule],
})
export class NewUser {
  departments: Departments[] = [
    { value: '0', viewValue: 'VIP' },
    { value: '1', viewValue: 'Recepcion' },
    { value: '2', viewValue: 'Otros' },
  ];

  displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', 'demo-symbol'];
  dataSource = ELEMENT_DATA;

  aut = fireAuth;

  createUser(): void {
    createUserWithEmailAndPassword(this.aut, 'email@example.com', 'password')
      .then((userCredential) => {
        // El usuario se ha creado exitosamente
        const user = userCredential.user;
      })
      .catch((error) => {
        // Ha ocurrido un error
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }


}
export interface Departments {
  value: string;
  viewValue: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];