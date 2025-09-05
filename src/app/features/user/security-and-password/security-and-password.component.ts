import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SecurityModel } from '../../../core/models/security-model';
import { UserSettingsService } from '../../../core/Services/user-settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-security-and-password',
  templateUrl: './security-and-password.component.html',
  styleUrl: './security-and-password.component.scss'
})
export class SecurityAndPasswordComponent  implements OnInit {

  userSettingForm!: FormGroup;
  userId!: string;
  getuserSetup: SecurityModel[] = [];

  constructor(private fb: FormBuilder, private userSetting: UserSettingsService,private toastr:ToastrService) { }

  // isChecked = false;

  // toggle(event: Event) {
  //   this.isChecked = (event.target as HTMLInputElement).checked;
  //   if( this.isChecked == true){
  //     this.userSettingForm.patchValue({
  //       isEmail:1
  //     })
  //   }else{
  //       this.userSettingForm.patchValue({
  //         isEmail:0
  //       })
  //   }
  // }





  ngOnInit() {
    this.userId = localStorage.getItem('id') ?? '';
    this.getUserSetup();
    this.createform();
  }


  userSetup() {
    console.log("form", this.formVal)
    this.userSetting.userSetup(this.formVal)
      .subscribe(
        (response: any) => {
          if (response === true) {
            this.toastr.success('2FA Enabled  Successfully"!', 'Success!');
            // this.toasterService.showToast('success', "2FA Enabled  Successfully", "top-right", true);
            this.getUserSetup()
          }
        }
      );

  }

  getUserSetup() {
    this.userSetting.getUserSetup(this.userId).subscribe((response: SecurityModel) => {
      if (response) {
        this.getuserSetup = response as SecurityModel[];
        console.log("aaa",this.getuserSetup)
        // let setup = this.getuserSetup[0];
        this.userSettingForm.patchValue(this.getuserSetup)
      } else {
        this.getuserSetup = [];
      }

    })
  }





  onToggleChanged(field: string, event: CustomEvent) {
    this.userSettingForm.get(field)?.setValue(event.detail.checked ? 1 : 0);
  }


  createform() {
    this.userSettingForm = this.fb.group({
      id: [0, []],
      userId: [this.userId, []],
      isEmail: [, []],
      isPhone: [, []],
      isFace: [, []]

    });

  }

  get f() {
    return this.userSettingForm.controls
  }
  get formVal() {
    return this.userSettingForm.value
  }
}
