import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverInfoModel } from '../../core/models/driver-info-model';
import { ProfileModel } from '../../core/models/profile-model';
import { GoogleMapsService } from '../../core/Services/google-maps.service';
import { NotificationService } from '../../core/Services/notification.service';
import { NotifyService } from '../../core/Services/notify.service';
import { RiderService } from '../../core/Services/rider.service';
import { UserSettingsService } from '../../core/Services/user-settings.service';
import { RiderNotificationComponent } from '../../features/rider-notification/rider-notification.component';
import { PlaceSearchResult } from '../place-and-time/place-and-time.component';

@Component({
  selector: 'app-rider-later',
  templateUrl: './rider-later.component.html',
  styleUrl: './rider-later.component.scss'
})
export class RiderLaterComponent  implements OnInit {

  fromValue: PlaceSearchResult = { address: '' };
  toValue: PlaceSearchResult = { address: '' };
  driverInfoData: DriverInfoModel[] = [];
  riderInfoItem:any[]=[];  
  map: any;
  searchBox: any;
  public CalendarOpened: boolean = false;
  public dateTime?: Date;
  public startAt = new Date(2018, 3, 10, 10, 30, 30);
  userId!:string;
  constructor( public modalService: NgbModal,private _router:Router,private sharedService: RiderService,private signalrService: NotifyService,
    private notificationService: NotificationService,private googleMapsService: GoogleMapsService,private userService:UserSettingsService,
    private dialog: MatDialog) { }


    
  ngOnInit() {
    this.userId=localStorage.getItem('id') ?? '';
    // this.initMap();
    this.getProfile();

    this.signalrService.startConnection();
    // this.signalrService.addReceiveNotificationListener();ReceiveApprovalNotification
    this.signalrService.hubConnection.on('ReceiveApprovalNotification', (riderId: number, driverInfoList: DriverInfoModel[]) => {
      console.log('Received approvaldddd notification:', { riderId,driverInfoList });
      if (riderId == this.riderInfoItem[0].riderId) {
        console.log("ok",driverInfoList)
        // alert();
        this.addNotificationToInbox(driverInfoList);
      } else {
        console.log('Notification not for this user, ignoring.');
      }
      // Process the notification as needed, or emit it to other components
      // For example, you could use a Subject to broadcast to other parts of the app
    });  
    
  }

  addNotificationToInbox(driverInfoList:any): void {
    this.driverInfoData.push(driverInfoList);
    console.log("this.messages",this.driverInfoData)
   this.openDialog()
  }

  
  openDialog(): void {
    // console.log("mess",this.driverInfoData)
    this.dialog.open(RiderNotificationComponent,  {
      width: '650px',
      maxHeight: '95vh',
      data: { driverData: this.driverInfoData}
    });
  }

  getProfile() {
    this.userService.getProfile(this.userId).subscribe(
      (response: ProfileModel) => {
        if (response) {
          this.riderInfoItem = [response];
          let data = this.riderInfoItem[0];
          console.log("ff",data)
          // if (data.dateOfBirth) {
          //   data.dateOfBirth = this.convertToDate(data.dateOfBirth);
          // }
        } else {
          this.riderInfoItem = [];
        }
      },
      (error) => {
        console.error("Error fetching profile data", error);
      }
    );
  }

  onButtonClick() {
    this.sharedService.triggerButtonClick();
  }
  // initMap(): void {

  //   const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
  //     zoom: 13,
  //     center: { lat: 23.777176, lng: 90.399452 },
  //   });

  //   const trafficLayer = new google.maps.TrafficLayer();
  //   trafficLayer.setMap(map);
  // }

  // initMap(): void {
  //   const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
  //     zoom: 13,
  //     center: { lat: 23.777176, lng: 90.399452 }, // Dhaka coordinates
  //   });

  //   // Create the search box and link it to the UI element.
  //   const input = document.getElementById('pac-input') as HTMLInputElement;
  //   const input1 = document.getElementById('pac-input1') as HTMLInputElement;
  //   const searchBox = new google.maps.places.SearchBox(input);

  //   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  //   // Bias the SearchBox results towards the current map's viewport.
  //   map.addListener('bounds_changed', () => {
  //     searchBox.setBounds(map.getBounds());
  //   });

  //   let markers: any[] = [];

  //   // Listen for the event fired when the user selects a prediction.
  //   searchBox.addListener('places_changed', () => {
  //     const places = searchBox.getPlaces();

  //     if (places.length == 0) {
  //       return;
  //     }

  //     // Clear out the old markers.
  //     markers.forEach((marker) => {
  //       marker.setMap(null);
  //     });
  //     markers = [];

  //     // For each place, get the icon, name and location.
  //     const bounds = new google.maps.LatLngBounds();
  //     places.forEach((place: any) => {
  //       if (!place.geometry || !place.geometry.location) {
  //         console.log('Returned place contains no geometry');
  //         return;
  //       }

  //       const icon = {
  //         url: place.icon,
  //         size: new google.maps.Size(71, 71),
  //         origin: new google.maps.Point(0, 0),
  //         anchor: new google.maps.Point(17, 34),
  //         scaledSize: new google.maps.Size(25, 25),
  //       };

  //       // Create a marker for each place.
  //       markers.push(
  //         new google.maps.Marker({
  //           map,
  //           icon,
  //           title: place.name,
  //           position: place.geometry.location,
  //         })
  //       );

  //       if (place.geometry.viewport) {
  //         bounds.union(place.geometry.viewport);
  //       } else {
  //         bounds.extend(place.geometry.location);
  //       }
  //     });
  //     map.fitBounds(bounds);
  //   });
  // }

  


  checkUserId() {
    if (!this.userId) {
      this._router.navigate(['/login']);
    } else {
      
    }
  }

  openCalendar() {
    this.CalendarOpened = true;
  }
  closeCalendar(){
    this.CalendarOpened = false;
  }

  modalServOpen(event:any){
    this.modalService.open(event,{size: 'md', windowClass: 'modal-md'})
    this.closeCalendar();

  }
  signUp(){
    this._router.navigate(['/signUp']);
  }

  // sendRiderRequest() {
  //   const message = 'VaaXY!, Ride Request from Rampura TV Center to Airport!';
  //   const userIds = ['user123', '2', '3'];
    
  //   this.notificationService.sendNotification(message, userIds).subscribe(
  //     response => {
  //       console.log('Notification sent successfully to multiple users', response);
  //     },
  //     error => {
  //       console.error('Error sending notification', error);
  //     }
  //   );
  // }


  

}