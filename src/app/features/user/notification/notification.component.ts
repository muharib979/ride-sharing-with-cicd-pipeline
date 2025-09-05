import { Component, Inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/Services/notification.service';
import { NotifyService } from '../../../core/Services/notify.service';
import { RideDetailsWithPriceComponent } from '../../../components/ride-details-with-price/ride-details-with-price.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RiderInfoModel } from '../../../core/models/rider-info-model';
import { UserSettingsService } from '../../../core/Services/user-settings.service';
import { DriverInfoModel } from '../../../core/models/driver-info-model';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {

  flattenedMessages: any;
  getDriverInfoItem: any = [];
  userName?: string;
  userId!: string;
  driverId!: number;
  signUpAs?: string;
  picture?: string;
  picture64?: string;
  expi: any

  convertToDateExp(dateString: string): Date | null {
    if (!dateString || dateString.length !== 6) return null;

    // Ensure dateString is in MMYYYY format
    const month = parseInt(dateString.slice(0, 2), 10) - 1; // months are 0-indexed
    const year = parseInt(dateString.slice(2, 6), 10);

    return new Date(year, month);
  }

  constructor(private _router: Router, private signalrService: NotifyService, private notificationService: NotificationService, private setting: UserSettingsService, private toast: NgToastService,
    private dialog: MatDialog, public dialogRef: MatDialogRef<NotificationComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: RiderInfoModel[] }) { }

  ngOnInit() {
    this.userName = localStorage.getItem('firstName') ?? '';
    this.signUpAs = localStorage.getItem('signUpAs') ?? '';
    this.picture = localStorage.getItem('picture') ?? '';
    this.picture64 = localStorage.getItem('pictureBase64') ?? '';
    this.userId = localStorage.getItem('id') ?? '';
    this.flattenedMessages = this.data.message[0];
    console.log("loca",this.flattenedMessages[0].from)
    this.getProfile();


  }


  getProfile() {
    this.setting.getProfileDriver(this.userId).subscribe(
      (response: any) => {
        if (response) {
          this.getDriverInfoItem = response as any[];

          // console.log("dataDriver", this.getDriverInfoItem);
          let data = this.getDriverInfoItem[0];
          this.expi = this.getDriverInfoItem[0];

          // if (data.dateOfBirth) {
          //   data.dateOfBirth = this.convertToDate(data.dateOfBirth);
          // }
          if (data.expirationDate) {
            data.expirationDate = this.convertToDateExp(data.expirationDate);
            this.expi = data.expirationDate
          }

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

  driverApprove(message: any) {
    const driverInfoList: DriverInfoModel[] = [
      {
        driverId: this.getDriverInfoItem[0].driverId,
        driverName: this.userName,
        userId: this.userId,
        email: 'amran979@gmail.com',
        phoneNumber: '123-456-7890',
        gender: 'Male',
        licenseNumber: this.getDriverInfoItem[0].licenseNumber,
        numberPlate: this.getDriverInfoItem[0].numberPlate,
        expirationDate: this.getDriverInfoItem[0].expirationDate,
        brand: this.getDriverInfoItem[0].brand,
        color: this.getDriverInfoItem[0].color,
        launchhYear: this.getDriverInfoItem[0].launchhYear,
        modal: this.getDriverInfoItem[0].modal,
        rattingLower: '4.5',
        rattingUpper: '5',
        picture: this.picture,
        pictureBase64: this.picture64,
        latitude: 0,
        longitude: 0
      }

    ];
    console.log("rider", message.riderId)
    this.notificationService.driverApprove(message.riderId, driverInfoList).subscribe(
      response => {
        this.toast.success("Confirm Approved", "SUCCESS", 3000);
        this.dialogRef.close();
        this._router.navigate(['/map'], { queryParams: { fromAddress:message.from} });

      },
      error => {
        this.toast.danger("Error Confirm Approved");
      }
    );
  }


  onClose(): void {
    this.dialogRef.close();
  }

}
