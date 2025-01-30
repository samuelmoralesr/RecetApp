import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Storage } from '@ionic/storage-angular';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
defineCustomElements(window)

@Component({
  selector: 'app-edit-profile-info',
  templateUrl: './edit-profile-info.page.html',
  styleUrls: ['./edit-profile-info.page.scss'],
  standalone: false
})
export class EditProfileInfoPage implements OnInit {
  user_data: any = {
    name: '',
    last_name: '',
    email: '',
    image: '',
    followees: [],
    followers: []
  };
  edit_image: any = '';
  editInfoForm: FormGroup;
  formErrors= {
    name: [
      { type: 'required', message: 'El nombre es obligatorio.' },
      { type: 'minlength', message: 'El nombre debe tener al menos 2 caracteres.' },
      { type: 'maxlength', message: 'El nombre no puede tener más de 70 caracteres.' }
    ],
    last_name: [
      { type: 'required', message: 'El apellido es obligatorio.' },
      { type: 'minlength', message: 'El apellido debe tener al menos 2 caracteres.' },
      { type: 'maxlength', message: 'El apellido no puede tener más de 70 caracteres.' }
    ]
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private storage: Storage,
    private modalController: ModalController,
    public  alertController: AlertController
  ) { 
    this.editInfoForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(70),
      ])),
      last_name: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(70),
      ]))
    })
  }

  async ngOnInit() {
    const user = await this.storage.get("user")
    this.user_data = user;
  }

  async takePhoto(source: CameraSource) {
    console.log('Take Photo');
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: source,
      quality: 100
    });
    console.log(capturedPhoto.dataUrl);
    this.user_data.image = capturedPhoto.dataUrl;
    this.edit_image = capturedPhoto.dataUrl;
    this.update();
  }

  async update(){
    this.userService.updateUser(this.user_data).then(
      (data) => {
        console.log(data);
      }
    ).catch(
      (error) =>{
        console.log(error);
      });
  }

  async presentPhotoOptions() {
    const alert = await this.alertController.create({
      header: "Seleccione una opción",
      message: "¿De dónde desea obtener la imagen?",
      buttons:[
        {
          text: "Cámara",
          handler: () => {
            this.takePhoto(CameraSource.Camera);
          }
        },
        {
          text: "Galería",
          handler: () => {
            this.takePhoto(CameraSource.Photos);
          }
        },
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            console.log('Cancelado');
          }
        }
      ]
    });
    await alert.present();
  }

  editInfo(edit_data: any){
    console.log('Edit page');
    console.log(edit_data);
    console.log(this.user_data);
    console.log(this.edit_image, "edit image");

    edit_data.name == '' ? delete this.user_data.name : this.user_data.name = edit_data.name
    edit_data.last_name == '' ? delete this.user_data.last_name : this.user_data.last_name = edit_data.last_name
    this.edit_image == '' ? this.user_data.image : this.user_data.image = this.edit_image

    console.log(this.user_data, 'post para enviar');
    this.userService.updateUser(this.user_data).then(
      (data: any) =>{
        console.log(data, 'post creado');
        this.modalController.dismiss({null: null});
        this.storage.set('user', data.user)
      },
      (error) =>{
        console.log(error, 'error');
      }
    )
  }

  cancelButton(){
    this.modalController.dismiss({null: null});
  }

}
