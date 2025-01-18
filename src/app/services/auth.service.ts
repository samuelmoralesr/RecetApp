import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(credentials: any){
    console.log(credentials, "desde el servicio");
    return new Promise ((accept, reject) => {
      if (
        credentials.email === 'samuel@gmail.com' && 
        credentials.password === '123456'
      ){
        accept('Login correcto');
      }else{
        reject('Credenciales incorrectas. Por favor, compruébalas.');
      }
    });
  }
}
