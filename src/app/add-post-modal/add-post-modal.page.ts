import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Storage } from '@ionic/storage-angular';
import { ModalController, AlertController } from '@ionic/angular';
defineCustomElements(window)

@Component({
  selector: 'app-add-post-modal',
  templateUrl: './add-post-modal.page.html',
  styleUrls: ['./add-post-modal.page.scss'],
  standalone: false
})
export class AddPostModalPage implements OnInit {
  post_image: any;
  addPostForm: FormGroup;
  formErrors= {
    description: [
      { type: 'required', message: 'La descripción es obligatoria.' },
      { type: 'minlength', message: 'La descripción debe tener al menos 6 caracteres.' },
      { type: 'maxlength', message: 'La descripción no puede tener más de 500 caracteres.' }
    ]
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private storage: Storage,
    private modalController: ModalController,
    private alertController: AlertController
  ) { 
    this.addPostForm = this.formBuilder.group({
      description: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(500),
      ])),
      image: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
  }

  async takePhoto(source: CameraSource) {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: source,
        quality: 100
      });
      this.post_image = capturedPhoto.dataUrl;
      this.addPostForm.patchValue({ image: this.post_image });
    } catch (error) {
      console.log('Error al tomar la foto', error);
    }
  }

  async presentPhotoOptions() {
    const alert = await this.alertController.create({
      header: 'Seleccione una opción',
      message: '¿De dónde desea obtener la imagen?',
      buttons: [
        {
          text: 'Cámara',
          handler: () => {
            this.takePhoto(CameraSource.Camera);
          }
        },
        {
          text: 'Galería',
          handler: () => {
            this.takePhoto(CameraSource.Photos);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Publicación',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async addPost(post_data: any) {
    const user = await this.storage.get('user');
    if (!user) {
      this.presentAlert('No se encontró información del usuario. Intenta nuevamente.');
      return;
    }

    const post_param = {
      post: {
        description: post_data.description,
        image: post_data.image,
        user_id: user.id
      }
    };

    this.postService.createPost(post_param).then(
      async (data: any) => {
        data.user = {
          id: user.id,
          name: user.name,
          image: user.image || 'assets/image/default-avatar.jpg'
        };
        this.postService.postCreated.emit(data);
        this.addPostForm.reset();
        this.post_image = null;
        await this.presentAlert('Tu post se ha publicado correctamente.');
        this.modalController.dismiss();
      },
      async (error) => {
        console.log(error, 'error');
        await this.presentAlert('Hubo un error al publicar el post. Intenta nuevamente.');
      }
    );
  }
  cancelButton(){
    this.modalController.dismiss({null: null});
  }

}
