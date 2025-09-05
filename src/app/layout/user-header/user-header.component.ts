import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifyService } from '../../core/Services/notify.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../core/Services/notification.service';
import { NotificationComponent } from '../../features/user/notification/notification.component';
import { UserSettingsService } from '../../core/Services/user-settings.service';
import { ToastrService } from 'ngx-toastr';
import { RiderInfoModel } from '../../core/models/rider-info-model';
import { DriverInfoModel } from '../../core/models/driver-info-model';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss'
})
export class UserHeaderComponent implements OnInit {
  sendOtpForm?: FormGroup
  userName?: string;
  userId!: string;
  driverId!: number;
  signUpAs?: string;
  picture?: string;
  isRTL?: boolean;
  messages: RiderInfoModel[] = [];
  location!: google.maps.LatLng
  public CalendarOpened: boolean = false;
  picture64!: string;

  constructor(private fb: FormBuilder, private _router: Router,private signalrService: NotifyService,private notificationService: NotificationService,
    private dialog: MatDialog,private setting: UserSettingsService,private toastr:ToastrService) {
    // this.isRTL = signUp.isRTL; 
  }

  ngOnInit() {
    this.userName = localStorage.getItem('firstName') ?? '';
    this.signUpAs = localStorage.getItem('signUpAs') ?? '';
    this.picture = localStorage.getItem('picture') ?? '';
    this.picture64 = localStorage.getItem('pictureBase64') ?? '' ;
    // this.getImage();
    this.userId=localStorage.getItem('id')?? '';
    // this.driverId = localStorage.getItem('driverId') ?? '';
    this.driverId = Number(localStorage.getItem('driverId')) || 0 ;

    this.signalrService.startConnection();
    // this.signalrService.addReceiveNotificationListener();
    this.signalrService.hubConnection.on('ReceiveNotification', (riderInfoList: RiderInfoModel[], driverId: number) => {
      const currentUserId = this.driverId; 
      console.log('Notification received from backend: ', { riderInfoList, driverId });
      // this.signalrService.hubConnection.off('ReceiveNotification');

      // Check if the notification is meant for the current user
      if (driverId === this.driverId) {
        this.addNotificationToInbox(riderInfoList);
      } else {
        console.log('Notification not for this user, ignoring.');
      }
    });


    this.createForm();
  }

  addNotificationToInbox(riderInfoList:any): void {
    this.messages.push(riderInfoList);
    console.log("this.messages",this.messages)
   this.openDialog()
  }

  
  openDialog(): void {
    console.log("mess",this.messages)
    this.dialog.open(NotificationComponent,  {
      width: '650px',
      maxHeight: '95vh',
      data: { message: this.messages}
    });
  }

  scurityAndPasssword() {
    this._router.navigate(['/scurity-password']);
  }
  currentLocation:any;
  goOnline(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            console.log('User location:', lat, lng);
  
            // Now get the place name from latitude and longitude
            this.goOnlineSave(lat, lng);
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              console.error('User denied location access');
              alert('Location access is required. Please enable location services.');
            }
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }
    // this.currentLocation = new google.maps.LatLng(lat, lng);
    //       console.log('Current location: ', this.currentLocation);
    // console.log("map",)
    goOnlineSave(lat: number, lng: number): void {
    let param ={
      driverId: this.driverId,
      latitude: lat,
      longitude:lng,
      userId:this.userId,
      status:'Online',
      isOnline:'1'
  
    }
    this.setting.goOnline(param)
      .subscribe(
        (response: any) => {
          if (response === 1) {
            this.toastr.success('Online Successfully"!', 'Success!');
            // this.toasterService.showToast('success', "2FA Enabled  Successfully", "top-right", true);
          }
        }
      );
   
  }




  inbox() {
    this._router.navigate(['/inbox']);
  }
  profile() {
    if (this.signUpAs == "Driver") {
      this._router.navigate(['/profile-driver']);
    } else if (this.signUpAs == "Business") {
      this._router.navigate(['/profile-business']);
    }
    else {
      this._router.navigate(['/profile']);
    }
  }
  security() {
    this._router.navigate(['/security']);
  }
  preferences() {
    this._router.navigate(['/preferences']);
  }
  paymentSetting() {
    this._router.navigate(['/payment-setting']);
  }
  termsAndConditions() {
    this._router.navigate(['/terms-and-conditions']);
  }
  privacyStatement() {
    this._router.navigate(['/privacy-statement']);
  }
  helpAndSupport() {
    this._router.navigate(['/help-and-support']);
  }
  userDocumentation() {
    this._router.navigate(['/user-documentation']);
  }

  // modalServOpen(event:any){
  //   this.modalService.open(event,{size: 'md', windowClass: 'modal-md'})

  // }


  logout() {
    localStorage.removeItem('firstName');
    localStorage.removeItem('token');
    localStorage.removeItem('picture');
    localStorage.removeItem('id');
    // this._router.navigate(['/login']);
    this._router.navigate(['']);
    // this.signUp.redirect('/login');
    // this._router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     window.location.reload(); // Reload the page on navigation end
    //   }
    // });
  }


  openCalendar() {
    this.CalendarOpened = true;
  }
  closeCalendar() {
    this.CalendarOpened = false;
  }


  createForm() {
    this.sendOtpForm = this.fb.group({
      email: [, []],
    })
  }

  get f() {
    return this.sendOtpForm?.controls
  }

}
