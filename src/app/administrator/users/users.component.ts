import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fireAuth, fireDb, fireRdb, refdb } from 'src/app/app.module';
import { ActionCodeOperation, onAuthStateChanged, sendSignInLinkToEmail } from 'firebase/auth';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BehavService } from 'src/app/services/behav.service';
import { onValue, push, set } from 'firebase/database';

export interface Employers {
  name: string;
  secondname: string;
  email: number;
  office: string[];
  isadmin: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatSelectModule, MatDialogModule, MatButtonModule, MatTableModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  rdb = fireRdb;
  auth = fireAuth;
  displayedColumns: string[] = ['position', 'name', 'email', 'office', 'uid'];
  dataSource!: MatTableDataSource<Employers>;
  constructor(public dialog: MatDialog) { }

  addUser(): void {
    onAuthStateChanged(this.auth, (user) => {
      set(refdb(this.rdb, 'users/' + user?.uid), {
        dni: '000000',
        name: 'Raul',
        memail: 'apartamentoslapiramide@gmail.com',
        secondname: 'Ortega Ramos',
        displayname: user?.displayName,
        email: user?.email,
        phonenumber: user?.phoneNumber,
        photourl: user?.photoURL,
        uid: user?.uid,
        office: {
          value: '0',
          viewValue: 'VIP'
        },
        isadmin: false,
      })
    })
  }

  openDialog() {
    this.dialog.open(NewUser, { width: '320px' })
  }

  getUsers = async () => {
    let templist: Employers[] = [];
    onValue(refdb(this.rdb, 'users'), (snap) => {
      templist = [];
      snap.forEach((urx) => {
        const data = urx.val() as Employers
        templist.push(data);
      })
      this.dataSource = new MatTableDataSource(templist);
    }, { onlyOnce: true })
  }
  ngOnInit(): void {
    this.getUsers();
  }

}

@Component({
  selector: 'app-newusers',
  templateUrl: './newuser.html',
  styleUrls: ['./users.component.css'],
})

export class NewUser {
  auth = fireAuth;
  realdb = fireRdb;
  departments: Departments[] = [
    { value: '0', viewValue: 'VIP' },
    { value: '1', viewValue: 'Recepcion' },
    { value: '2', viewValue: 'Otros' },
  ];

  userform = new FormGroup({
    email: new FormControl('', Validators.required),
  })

  constructor(private bvhsrv: BehavService) { }

  actionCodeSettings = {
    // // URL you want to redirect back to. The domain (www.example.com) for this
    // // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:4200/login?email=' + this.userform.controls.email.value,
    //url: 'https://lapiramide-544e8.web.app/login?email=' + 'blizoomnet@gmail.com',
    // // This must be true.
    handleCodeInApp: true,
  };


  createUser(): void {
    console.log(this.userform.controls.email.value);
    if (this.userform.valid) {
      push(refdb(this.realdb, 'tempemploye/'), {
        email: this.userform.controls.email.value,
        office: 2,
        isadmin: false,
      })
    }
    this.bvhsrv.passSpin(true);
    sendSignInLinkToEmail(this.auth, this.userform.controls.email.value || '', this.actionCodeSettings).then((res) => {
      console.log(res);

      window.localStorage.setItem('emailForSignIn', this.userform.controls.email.value || '');
    }).catch((err) => {
      if (err.code === 'auth/quota-exceeded') {
        if (window.confirm('Ya es suficiente por hoy.')) {
          this.bvhsrv.passSpin(false);
        }
      }
    });
    this.bvhsrv.passSpin(false);
  }


}
export interface Departments {
  value: string;
  viewValue: string;
}

// const que = query(collection(this.db, 'empleados'))
// const employe = await getDocsFromCache(que)
// if (employe.empty === true) {
//   const sercat = await getDocsFromServer(que)
//   return sercat;
// } else {
//   employe.docChanges().forEach(async (res) => {
//     if (res.type === 'added') {
//       const sercat = await getDocsFromServer(que);
//       return sercat;
//     }
//     if (res.type === 'modified') {
//       const sercat = await getDocsFromServer(que);
//       return sercat;
//     }
//     if (res.type === 'removed') {
//       const sercat = await getDocsFromServer(que);
//       return sercat;
//     }
//     return employe;
//   })
// }
// return employe;