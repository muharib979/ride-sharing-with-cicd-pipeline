import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  public hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${environment.apiUrl}notificationHub`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      withCredentials: true
    })
      .build();
  }

  // Start the SignalR connection
  public startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('Error while starting SignalR connection: ' + err));
  }

  // Listen to the notification messages sent by the server
  // public addReceiveNotificationListener() {

  //   this.hubConnection.on('ReceiveNotification', (message: string, driverId: string) => {
  //     console.log(`Notification received from ${driverId}: ${message}`);
  //     if(driverId == '123'){
  //     alert(`New notification from ${driverId}: ${message}`);
  //     }
  //   });
  // }
}