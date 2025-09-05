import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { RiderInfoModel } from '../models/rider-info-model';
import { DriverInfoModel } from '../models/driver-info-model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private earthRadiusKm = 6371; 
  public hubConnection: signalR.HubConnection;

  constructor(private http: HttpClient,) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}notificationHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true
      })
      .build();
      
      
    // this.startConnection();
  }

  // private startConnection(): void {
  //   this.hubConnection
  //     .start()
  //     .then(() => {
  //       console.log('SignalR connection started');
  //       this.setupListeners();  // Set up listeners after connection is established
  //     })
  //     .catch(err => console.error('Error while starting SignalR connection: ', err));
  // }

  public startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('Error while starting SignalR connection: ' + err));
  }

  // Move the listener setup here so it’s done after the connection is ready
  public setupListeners(){
    this.hubConnection.on('ReceiveDriverNotification', (message: string) => {
      console.log('Driver received notification: ', message);
      alert('New Notification: ' + message); // Show notification or update the UI
    });

    // this.hubConnection.on('ReceiveRequest', (riderId: string, requestMessage: string) => {
    //   const fullMessage = `New request from Rider ${riderId}: ${requestMessage}`;
    //   console.log(fullMessage);
    // });
  }


  public sendRiderRequest( message: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiUrl}sendss`, JSON.stringify(message), { headers });
  }


  // sendNotification(message: string, userId: string): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   // Create a payload with both message and userId
  //   const payload = { message, userId };


  //   return this.http.post<any>(`${environment.apiUrl}send`, JSON.stringify(payload), { headers });
  // }

  sendNotification(riderInfoList: RiderInfoModel[], driverIds: number[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // Create the payload with the message (RiderInfoModel) and userIds list
    const payload = { riderInfoList, driverIds };
  
    // Send the HTTP POST request with the JSON payload
    return this.http.post<any>(`${environment.apiUrl}send`, JSON.stringify(payload), { headers });
  }

  driverApprove( riderId: number,driverInfoList: DriverInfoModel[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // Create the payload with the message (RiderInfoModel) and userIds list
    const payload = {riderId, driverInfoList };
  
    // Send the HTTP POST request with the JSON payload
    return this.http.post<any>(`${environment.apiUrl}driver-approve`, JSON.stringify(payload), { headers });
  }
  

  getNearLocation(latitude: number,longitude:number) {
    return this.http.get(`${environment.apiUrl}drivers-nearby/${latitude}/${longitude}`);
  }
  
}
