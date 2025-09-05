import { Component, OnInit } from '@angular/core';
import { PreferenceModel } from '../../../core/models/preference-model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserSettingsService } from '../../../core/Services/user-settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrl: './preference.component.scss'
})
export class PreferenceComponent  implements OnInit {
  userPreferenceForm!:FormGroup;
  rattingForm!:FormGroup;
  getPreferenceData: PreferenceModel[] = [];
  userId!:string;
  constructor(private fb:FormBuilder,private userSetting: UserSettingsService,private toastr:ToastrService) { }

  ngOnInit() {
    this.userId=localStorage.getItem('id') ?? '';
    this.getPreference();
    this.createform();
  }

  userPreferenceSave() {
    console.log("form", this.formVal)
    this.userSetting.userPreferenceSave(this.formVal)
      .subscribe(
        (response: any) => {
          if (response === true) {
            this.toastr.success('Preferences Save  Successfully!', 'Success!');
            // this.toasterService.showToast('success', "Preference Save Successfully", "top-right", true);
            // this.getUserSetup()
          }
        }
      );

  }


  getPreference() {
    this.userSetting.getPreference(this.userId).subscribe((response: PreferenceModel) => {
      if (response) {
        this.getPreferenceData = response as PreferenceModel[];
        console.log("ddd",this.getPreferenceData)
        
        this.userPreferenceForm.patchValue(this.getPreferenceData)
         const lowerData = this.formVal.lower
         const upperData = this.formVal.upper
         console.log("data",lowerData)
          this.userPreferenceForm.patchValue({
            rangeValues: {
              lower: lowerData,
              upper: upperData
            }
          });
          // if (typeof lowerData === 'number' && typeof upperData === 'number') {
          //   this.userPreferenceForm.patchValue({
          //     rangeValues: {
          //       lower: lowerData,
          //       upper: upperData
          //     }
          //   });
          // } else {
          //   console.error('Error: lower and upper values are not numbers', { lowerData, upperData });
          // }
       
      } else {
        this.getPreferenceData = [];
      }

    })
  }

  
  onToggleChanged(field: string, event: CustomEvent) {
    this.userPreferenceForm.get(field)?.setValue(event.detail.checked ? 1 : 0);
  }
   onRangeChange(event: any) {
    console.log(event.detail.value);
    console.log(event.detail.value.lower);
    console.log(event.detail.value.upper);
    const lowerValue = event.detail.value.lower;
    const upperValue = event.detail.value.upper;
    this.userPreferenceForm.patchValue({
      lower:event.detail.value.lower,
      upper:event.detail.value.upper
    })
  
    // this.userPreferenceForm.get('rangeValues').setValue({
    //   lower: lowerValue,
    //   upper: upperValue
    // });
  }

  createform() {
    this.userPreferenceForm = this.fb.group({
      id: [0, []],
      userId: [this.userId, []],
      isVaaXY1: [, []],
      isVaaXY2: [, []],
      isVaaXY3: [, []],
      isVaaXY4: [, []],
      isVaaXYValue: [, []],
      isVaaXYRelax: [, []],
      isVaaXYElite: [, []],
      isVaaXYPets: [, []],
      isCool: [, []],
      isWarm : [, []],
      isNormal : [, []],
      isAvoidTollRoad: [, []],
      isOkayWithTollRoad: [, []],
      lower: [0, []],
      upper: [0, []],
      rangeValues: this.fb.group({
        lower: [0, []],
        upper: [1, []]
      })
    });

  }

  

 

  get f() {
    return this.userPreferenceForm.controls
  }
  get formVal() {
    return this.userPreferenceForm.value
  }

}