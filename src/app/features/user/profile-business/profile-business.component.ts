import { Component, ElementRef, OnInit, signal, VERSION, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Country } from 'country-state-city';
import { ToastrService } from 'ngx-toastr';
import { ImagePreviewDialogComponent } from '../../../components/image-preview-dialog/image-preview-dialog.component';
import { ProfileModel } from '../../../core/models/profile-model';
import { AuthService } from '../../../core/Services/auth.service';
import { UserSettingsService } from '../../../core/Services/user-settings.service';

@Component({
  selector: 'app-profile-business',
  templateUrl: './profile-business.component.html',
  styleUrl: './profile-business.component.scss'
})
export class ProfileBusinessComponent implements OnInit {

  @ViewChild('country', {static: false}) country?: ElementRef
  @ViewChild('city', {static: false}) city?: ElementRef
  @ViewChild('state', {static: false}) state?: ElementRef
  name = 'Angular ' + VERSION.major;
  personal:boolean=true;
  business:boolean=false;
  countries:any[]=[];
  fileName1: string = ''
  selectedFiles: { fieldName: string, file: File }[] = [];
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  isHovered = false;
  normalColor = '#3f51b5';  // default color
  hoverColor = '#000';    // hover color
  onMouseEnter() {
    this.isHovered = true;
  }
  onMouseLeave() {
    this.isHovered = false;
  }

  getGenderList: any[] = [{ id: 1, name: "Male" }, { id: 2, name: "FeMale" }, { id: 3, name: "He/She" }, { id: 4, name: "Others" }];
  states: string[] = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

  cities = null;

  selectedCountry:any;
  selectedState:any;
  selectedCity:any;
  message = '';
  title = '';

  picture?: string;
  picture64?: string;
  userName?: string;
  userId!: string;
  businessEditForm!:FormGroup
  getAllUserItem:any[]=[];  
  isChecked = false;
  constructor(private fb:FormBuilder,private dialog:MatDialog, private authService:AuthService,private userService:UserSettingsService
    ,private toastr:ToastrService
  ) { }

  profileType: string = 'Personal';
  convertToBase64(byteArray: Uint8Array): string {
    return btoa(String.fromCharCode.apply(null, Array.from(byteArray)));
  }
  public handleErrorRegister(controlName: string, errorName: string) {
    return (
      this.businessEditForm.get(controlName)?.touched &&
      this.businessEditForm.get(controlName)?.errors &&
      this.businessEditForm.get(controlName)?.hasError(errorName)
    );
  }


  ngOnInit() {
    this.picture = localStorage.getItem('picture') ?? '';
    this.picture64 = localStorage.getItem('pictureBase64') ?? '';
    this.userName = localStorage.getItem('firstName')?? '';
    this.userId=localStorage.getItem('id')?? '';
    this.countries = Country.getAllCountries();
    console.log("country",this.countries.filter(a => a.name=='United States'))
    let country= this.countries.filter(a => a.name=='United States')

    this.getProfile();
    this.createForm();

    // let county = this.countries.filter(a => a.name == 'United States')
    // this.businessEditForm.patchValue({
    //   country: county[0].name,
    //   phoneCode: county[0].phonecode,

    // })
  }

  // onCountryChange(event: any): void {
  //   const defaultCountry = this.countries.find(country => country.name === event.value);
  //   this.businessEditForm.patchValue({
  //     phoneCode: defaultCountry.phonecode,
  //   })
  // }

  switchProfile(): void {
    this.profileType = this.profileType === 'Personal' ? 'Business' : 'Personal';
    if(this.profileType == 'Personal'){
      this.personal=true;
      this.business=false;
    }else{
      this.business=true;
      this.personal=false;
    }
  }
  
  saveBusiness(){
    console.log("model",this.formVal)
    this.userService.updateBusiness(this.formVal)
    .subscribe(
    (response: any) => {
      if (response === true) {
        this.toastr.success('Business Update  Successfully!', 'Success!');
        // this.toasterService.showToast('success', "Rider Updated  Successfully", "top-right", true);
      }     
    }  
    );
 
  }
  convertToDate(dateString: string): Date | null {
    if (!dateString) return null;
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1; // months are 0-indexed
    const day = parseInt(dateString.slice(6, 8), 10);  
    return new Date(year, month, day);
  }
  
  getProfile() {
    this.userService.getProfileBusiness(this.userId).subscribe(
      (response: any) => {
        if (response) {
          this.getAllUserItem = response as any[];;
          let data = this.getAllUserItem[0];
          console.log("data",data)
          this.businessEditForm.patchValue(data);

        } else {
          this.getAllUserItem = [];
        }
      },
      (error) => {
        console.error("Error fetching profile data", error);
      }
    );
  }
  
  
  onFileSelected(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // this.setFileName(fieldName, file.name);
      const fileName = file.name;

      if (fieldName === 'picture') {
        this.fileName1 = fileName;
      }

      this.selectedFiles.push({ fieldName, file });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.openDialog(e.target.result, fieldName);
      };
      reader.readAsDataURL(file);
    }
  }

  openDialog(imageSrc: string, fieldName: string): void {
    this.dialog.open(ImagePreviewDialogComponent, {
      data: { imageSrc, fieldName }
    });
  }

  createForm() {
    this.businessEditForm = this.fb.group({
      userId: [this.userId, []],
      businessName: [, []],
      contactPerson: [, []],
      contactPhoneNumber: [, []],
      businessPhoneNumber: [, []],
      numOfEmp: [, []],
      email: [, []],
      businessLogo: [1, []],
      streetAddress: [, []],
      city: [, []],
      state: [, []],
      zipCode: [, []],
    })
  } 
  get f() {
    return this.businessEditForm.controls;
  }

  get formVal() {
    return this.businessEditForm.value;
  }


}
