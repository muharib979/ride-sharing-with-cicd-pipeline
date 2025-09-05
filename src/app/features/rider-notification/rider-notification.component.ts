import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DriverInfoModel } from '../../core/models/driver-info-model';
import { RiderInfoModel } from '../../core/models/rider-info-model';
import { NotificationService } from '../../core/Services/notification.service';
import { NotifyService } from '../../core/Services/notify.service';
import { UserSettingsService } from '../../core/Services/user-settings.service';
import { NotificationComponent } from '../user/notification/notification.component';

@Component({
  selector: 'app-rider-notification',
  templateUrl: './rider-notification.component.html',
  styleUrl: './rider-notification.component.scss'
})
export class RiderNotificationComponent {

  flattenedMessages:any;
  getDriverInfoItem:any=[];
  userName?: string;
  userId!: string;
  driverId!: number;
  signUpAs?: string;
  picture?: string;
  picture64?: string;

  constructor(private signalrService: NotifyService,private notificationService: NotificationService,private setting: UserSettingsService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<NotificationComponent>,@Inject(MAT_DIALOG_DATA) public data: { driverData: DriverInfoModel[]}) {}

  ngOnInit() {
    this.userName = localStorage.getItem('firstName') ?? '';
    this.signUpAs = localStorage.getItem('signUpAs') ?? '';
    this.picture = localStorage.getItem('picture') ?? '';
    this.picture64 = localStorage.getItem('pictureBase64') ?? '';
    this.userId=localStorage.getItem('id')?? '';
     this.flattenedMessages = this.data.driverData[0];
     this.getProfile();


  }

  
  getProfile() {
    this.setting.getProfileDriver(this.userId).subscribe(
      (response: any) => {
        if (response) {
          this.getDriverInfoItem = response as any[];
  
          console.log("dataDriver", this.getDriverInfoItem);
          let data = this.getDriverInfoItem[0];
  
          // if (data.dateOfBirth) {
          //   data.dateOfBirth = this.convertToDate(data.dateOfBirth);
          // }
          // if (data.expirationDate) {
          //   data.expirationDate = this.convertToDateExp(data.expirationDate);
          // }

          // this.riderEditForm.patchValue(data);
          //   this.riderEditForm.patchValue({
          //     phoneCode:'1'
          //   });
  
          // Verify the form after patching
  
        } else {
          this.getDriverInfoItem = [];
        }
      },
      (error) => {
        console.error("Error fetching profile data", error);
      }
    );
  }




  onClose(): void {
    this.dialogRef.close();
  }

}
