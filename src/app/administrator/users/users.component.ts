import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fireAuth, fireDb, fireRdb, refdb } from 'src/app/app.module';
import { ActionCodeOperation, onAuthStateChanged, sendSignInLinkToEmail } from 'firebase/auth';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BehavService } from 'src/app/services/behav.service';
import { onValue, push, remove, set, update } from 'firebase/database';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioChange } from '@angular/material/radio';


export interface Employers {
  id: string
  birdday: string;
  department: string;
  dni: string;
  email: string;
  firstname: string;
  isAdmin: boolean;
  isModerator: boolean
  secondname: string;
  uid: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatSelectModule, MatDialogModule, MatButtonModule, MatTableModule,
    MatSnackBarModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  rdb = fireRdb;
  auth = fireAuth;
  displayedColumns: string[] = ['position', 'name', 'email', 'department', 'birdday', 'uid', 'level', 'delete', 'edit'];
  dataSource!: MatTableDataSource<Employers>;
  constructor(public dialog: MatDialog, public snack: MatSnackBar) { }

  addUser(): void {
    //onAuthStateChanged(this.auth, (user) => {
    //   set(refdb(this.rdb, 'users/' + user?.uid), {
    //     dni: '000000',
    //     name: 'Raul',
    //     memail: 'apartamentoslapiramide@gmail.com',
    //     secondname: 'Ortega Ramos',
    //     displayname: user?.displayName,
    //     email: user?.email,
    //     phonenumber: user?.phoneNumber,
    //     photourl: user?.photoURL,
    //     uid: user?.uid,
    //     office: {
    //       value: '0',
    //       viewValue: 'VIP'
    //     },
    //     isadmin: false,
    //   })
    // })
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
        const id = urx.key;
        templist.push({ ...data, id });
      })
      this.dataSource = new MatTableDataSource(templist);
    })
  }

  deleteUser(urx: Employers): void {
    if (window.confirm('Estas seguro que quieres eliminar este usuario')) {
      remove(refdb(this.rdb, 'users/' + urx.id)).then((res) => {
        this.snack.open('El usuario fue eliminado', 'Ok', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'right' });
      })
    }
  }
  editUser(urx: Employers): void {
    this.dialog.open(EditUser, {
      width: '100%', disableClose: true, data: {
        firstname: urx.firstname,
        secondname: urx.secondname,
        email: urx.email,
        dni: urx.dni,
        birdday: urx.birdday,
        department: urx.department,
        id: urx.id,
        isAdmin: urx.isAdmin,
        isModerator: urx.isModerator
      }
    })
  }
  ngOnInit(): void {
    this.getUsers();
  }

}

@Component({
  selector: 'app-editusers',
  templateUrl: './edituser.html',
  styleUrls: ['./users.component.css'],
})

export class EditUser {
  rdb = fireRdb
  isSmall = false;
  memail = ''
  hidefpass = true;
  hiderpass = true;
  wrongpass = false;
  userLevel = '2'
  isAdmin = false;
  isModerator = false;
  logform = new FormGroup({
    firstname: new FormControl('', Validators.required),
    secondname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required, Validators.pattern('[a-z0-9]{3,}@[a-z]{2,}.[a-z]{2,}')]),
    dni: new FormControl(''),
    birdday: new FormControl(new Date()),
    department: new FormControl(''),
  })

  constructor(public bhvsrv: BehavService, public snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public usr: Employers, public dialRef: MatDialogRef<EditUser>) {
    if (usr) {
      this.logform.setValue({
        firstname: usr.firstname,
        secondname: usr.secondname,
        email: usr.email,
        dni: usr.dni,
        birdday: new Date(usr.birdday),
        department: usr.department,
      })

      if (usr.isAdmin === true) {
        this.userLevel = '0';
      } else if (usr.isModerator === true) {
        this.userLevel = '1';
      } else {
        this.userLevel = '';
      }
    }
  }

  radioChange(event: MatRadioChange): void {
    console.log(event.value);
    if (event.value === '0') {
      this.isAdmin = true;
      this.isModerator = false;
    } else if (event.value === '1') {
      this.isAdmin = false;
      this.isModerator = true;
    } else if (event.value === '2') {
      this.isAdmin = false;
      this.isModerator = false;
    } else {
      this.isAdmin = false;
      this.isModerator = false;
    }

  }

  updateUser(urx: string): void {
    if (this.logform.valid) {
      this.bhvsrv.passSpin(true);
      update(refdb(this.rdb, 'users/' + urx), {
        firstname: this.logform.controls.firstname.value,
        secondname: this.logform.controls.secondname.value,
        email: this.logform.controls.email.value,
        dni: this.logform.controls.dni.value,
        birdday: this.logform.controls.birdday.value,
        department: this.logform.controls.department.value,
        isAdmin: this.isAdmin,
        isModerator: this.isModerator
      }).then(() => {
        this.snack.open('Actualizacion con exito', 'Ok', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'right' })
        this.bhvsrv.passSpin(false);
        this.dialRef.close();
      }).catch((err) => {
        console.log(err);
      })
    }
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
  emkey = '';


  userform = new FormGroup({
    email: new FormControl('', Validators.required),
  })

  constructor(private bvhsrv: BehavService) { }
  actionCodeSettings = {
    // // URL you want to redirect back to. The domain (www.example.com) for this
    // // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:4200/login?encodeEmail=' + this.userform.controls.email.value + ';?codeKey?' + this.emkey,
    //url: 'https://lapiramide-544e8.web.app/login?email=' + 'blizoomnet@gmail.com',
    // // This must be true.
    handleCodeInApp: true,
  }
  createUser(): void {
    console.log(this.userform.controls.email.value);
    if (this.userform.valid) {
      push(refdb(this.realdb, 'tempuser/'), {
        email: this.userform.controls.email.value,
      }).then((result) => {
        this.emkey = result.key || '';
      })
    }
    this.bvhsrv.passSpin(true);
    sendSignInLinkToEmail(this.auth, this.userform.controls.email.value || '', this.actionCodeSettings).then((res) => {
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