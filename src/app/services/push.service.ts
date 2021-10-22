import { EventEmitter, Injectable } from '@angular/core';
// import OneSignal from 'onesignal-cordova-plugin';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  key: string = "";
  value: string = "";
  mensajes: OSNotificationPayload[] = [];

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal) {
    this.cargarMensajes();
  }

  async getMensajes() {
    console.log('Get Mensajes Invocada');
    await this.cargarMensajes();
    return [...this.mensajes];
  }

  configuracionInicial(){
    console.log('Configuracion Inicial Invocada');
    this.oneSignal.startInit('de2fa9c9-48ce-4245-83f9-1f1a15495ce3', '696094376186');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived().subscribe(( noti ) => {
    // do something when notification is received
      console.log('Notificacion recibida:', noti);
      this.notificacionRecibida( noti );
    });
    this.oneSignal.handleNotificationOpened().subscribe(( noti ) => {
      // do something when a notification is opened
      console.log('Notificacion abierta:', noti);
    });
    this.oneSignal.endInit();
  }

  async notificacionRecibida( noti: OSNotification ){
    console.log('Notificdacion Recibida Invocada');
    await this.cargarMensajes();
    const payload = noti.payload;
    const existePush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID);
    if(existePush){
      return;
    }
    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);
    this.guardarMensajes();
  }

  guardarMensajes(){
    console.log('Guardar Mensajes Invocada');
    Storage.set({key:'mensajes', value: JSON.stringify( this.mensajes )});
  }

  async cargarMensajes(){
    console.log('Cargar Mensajes Invocada');
    const resp = await Storage.get({key: 'mensajes'});
    this.mensajes = JSON.parse(resp.value) || [];
  }

  // save(){
  //   Storage.set({
  //     key: this.key,
  //     value: this.value
  //   }).then( () => console.log('Guardado!') );
  // }

  // get(){
  //   Storage.get({
  //     key: this.key
  //   }).then( (value) => {
  //     console.log('Value del key ' + this.key + ' es ' + value.value );
  //   })
  // }

  // remove(){
  //   Storage.remove({
  //     key: this.key
  //   }).then( (value) => {
  //     console.log('Value del key ' + this.key + ' fue eliminado ' );
  //   })
  // }

}
