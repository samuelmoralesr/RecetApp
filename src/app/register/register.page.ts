import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

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
    last_name: [
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
    ],
    password_confirmation: [
      { type: 'required', message: 'Debe confirmar la contraseña'},
      { type: 'passwordMismatch', message: 'Las contraseñas no coinciden'}
    ]
  }
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
  ) {
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),
      last_name: new FormControl('', Validators.compose([
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
      password_confirmation: new FormControl('', Validators.required)
    },{
      validators: this.matchPasswords('password', 'password_confirmation')
    });
  }

  ngOnInit() {
  }

  registerUser(registerData: any){
    this.authService.register(registerData).then(res =>{
      console.log(res);
      this.errorMessage = '';
      this.navCtrl.navigateForward('/login');
    }).catch(err =>{
      console.log(err);
      this.errorMessage = err;
    });
  }

  private matchPasswords(passwordKey: string, confirmPasswordKey: string){
    return (formGroup: FormGroup) =>{
      const password = formGroup.controls[passwordKey];
      const password_confirmation = formGroup.controls[confirmPasswordKey];

      if (password_confirmation.errors && !password_confirmation.errors['passwordMismatch']){
        return;
      }

      if (password.value != password_confirmation.value){
      password_confirmation.setErrors({passwordMismatch: true});
      }else{
        password_confirmation.setErrors(null);
      }
    }

  }


}
