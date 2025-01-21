import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  errorMessage: any;
  formErrors= {
    name: [
      { type: 'required', message: 'El nombre es obligatorio' },
      { type: 'minlength', message: 'El nombre debe tener al menos 2 caracteres' }
    ],
    lastname: [
      { type: 'required', message: 'El apellido es obligatorio' },
      { type: 'minlength', message: 'El apellido debe tener al menos 2 caracteres' }
    ],
    username: [
      { type: 'required', message: 'El nombre de usuario es obligatorio' },
      { type: 'minlength', message: 'El nombre de usuario debe tener al menos 4 caracteres' }
    ], 
    email: [
      { type: 'required', message: 'El correo es obligatorio' },
      { type: 'email', message: 'El correo no es valido'}
    ],
    password:[
      { type: 'required', message: 'La contraseña es obligatorio' },
      { type: 'password', message: 'La contraseña no es valida'}
    ]
  }
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),
      lastname: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }

  ngOnInit() {
  }

  registerUser(registerData: any){
    console.log(registerData, "Datos del registro")
  }

}
