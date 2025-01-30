import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { Storage } from '@ionic/storage-angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { ModalController } from '@ionic/angular';
import { EditProfileInfoPage } from '../edit-profile-info/edit-profile-info.page';
import { AlertController } from '@ionic/angular';
defineCustomElements(window)

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false
})
export class AccountPage implements OnInit {
  user_data: any = {
    name: '',
    email: '',
    image: '',
    followees: [],
    followers: []
  };
  isLoading: boolean = false;
  constructor(
    private userService: UserService,
    private storage: Storage,
    private modalController: ModalController,
    public  alertController: AlertController,
    private cdr: ChangeDetectorRef
  ) {}

    async ngOnInit() {
      let user: any = await this.storage.get('user');
      console.log(user, "usuario");
      this.userService.getUser(user.id).then(
        (data: any) =>{
          console.log(data);
          this.storage.set('user', data);
          this.user_data = data;
        }
      ).catch(
        (error) =>{
          console.log(error);
        });

        this.userService.userInfoUpdated.subscribe((newUpdate: any) => {
          console.log('Informacion actualizada:', newUpdate);
          this.user_data = Object.assign({}, this.user_data, newUpdate);
          this.storage.set('user', this.user_data);
          this.cdr.detectChanges();
        });
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
      this.update();
    }

    async update() {
      this.isLoading = true;
  
      this.userService.updateUser(this.user_data).then(
        (data: any) => {
          console.log('Usuario actualizado:', data);
          this.isLoading = false;
          this.userService.userInfoUpdated.emit(data);
          
        }
      ).catch((error) => {
        this.isLoading = false;
        console.log(error);
      });
    }

    async editInfo() {
      console.log("edit info");
      const edit = await this.modalController.create({
        component: EditProfileInfoPage,
        componentProps: []
      });
      return await edit.present();
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
  }
