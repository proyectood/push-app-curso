import { ApplicationRef, Component, OnInit } from '@angular/core';
import { OSNotificationPayload } from '@ionic-native/onesignal';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mensajes: OSNotificationPayload[] = [];
  constructor(private pushService: PushService, private applicationRef: ApplicationRef) {}

  ngOnInit(){
    console.log('Ng On Init Invocada');
    this.pushService.pushListener.subscribe( noti => {
      this.mensajes.unshift(noti);
      console.log(this.mensajes);
      console.log(JSON.stringify( this.mensajes ));
      this.applicationRef.tick();
    });
  }
  
  async ionViewWillEnter(){
    console.log('Will Enter Invocada');
    this.mensajes = await this.pushService.getMensajes();
    console.log(this.mensajes);
    console.log(JSON.stringify( this.mensajes ));
  }

}
