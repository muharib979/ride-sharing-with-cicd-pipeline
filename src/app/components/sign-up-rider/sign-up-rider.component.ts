import { AfterViewInit, Component, ElementRef, OnInit, signal, TemplateRef, VERSION, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {Router } from '@angular/router';
import { Country, State, City } from 'country-state-city';
import { Subscription, interval } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewDialogComponent } from '../image-preview-dialog/image-preview-dialog.component';
import { AuthService } from '../../core/Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TermsAndConditionsComponent } from '../../features/user/terms-and-conditions/terms-and-conditions.component';

@Component({
  selector: 'app-sign-up-rider',
  templateUrl: './sign-up-rider.component.html',
  styleUrl: './sign-up-rider.component.scss'
})
export class SignUpRiderComponent implements OnInit, AfterViewInit {

  signFormRider!: FormGroup;
  otpForm!: FormGroup;
  sendOtpForm!: FormGroup;
  otpPhoneForm!: FormGroup;
  @ViewChild('country', { static: false }) country!: ElementRef
  @ViewChild('city', { static: false }) city!: ElementRef
  @ViewChild('state', { static: false }) state!: ElementRef
  name = 'Angular ' + VERSION.major;
  countries: any[] = [];
  email: boolean = false;
  phone: boolean = false;
  // countries = Country.getAllCountries().filter(a => a.name=='United States');
  fileName1: string = ''
  selectedFiles: { fieldName: string, file: File }[] = [];
  cities: any;

  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  message = '';
  title = '';
  private lastInserted: number[] = [];
  timeLeft: number = 60;
  intervalSubscription: Subscription | undefined;
  otp!: string;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  @ViewChild('sendOTPEmail', { static: false }) sendOTPEmailTemplate!: TemplateRef<any>;
  @ViewChild('varifyOtpTemplate', { static: false }) varifyOtpTemplate!: TemplateRef<any>;
  @ViewChild('sendOTPPhone', { static: false }) sendOTPPhoneTemplate!: TemplateRef<any>;
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  public handleErrorRegister(controlName: string, errorName: string) {
    return (
      this.signFormRider.get(controlName)?.touched &&
      this.signFormRider.get(controlName)?.errors &&
      this.signFormRider.get(controlName)?.hasError(errorName)
    );
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

  getGenderList: any[] = [{ id: 1, name: "Male" }, { id: 2, name: "Female" }, { id: 3, name: "He/She" }, { id: 4, name: "Others" }];
  states: string[] = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


  constructor(

    private fb: FormBuilder,
    private authService: AuthService,
    public modalService: NgbModal,
    private _router: Router,
    private dialog: MatDialog,
    private toastr:ToastrService


  ) {

  }

  ngOnInit(): void {
    this.countries = Country.getAllCountries();
    this.states;
    this.createFormEmail();
    this.createOtpForm();
    this.createOtpPhoneForm();
    this.createForm();
    let county = this.countries.filter(a => a.name == 'United States')
    this.signFormRider.patchValue({
      country: county[0].name,
      phoneCode: county[0].phonecode,

    })

    this.startTimer();
  }

  ngAfterViewInit() {
    // Open the modal in ngAfterViewInit or in response to some user action
    this.openModal();
  }

  openModal() {
    if (this.sendOTPPhoneTemplate) {
      const modalRef = this.modalService.open(this.sendOTPPhoneTemplate, {
        size: 'md', windowClass: 'modal-md', backdrop: 'static',
        keyboard: false
      });
    } else {
      console.error('sendOTPEmailTemplate is not initialized');
    }
  }


  startTimer() {
    this.intervalSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
      }
    });
  }

  stopTimer() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
  ngOnDestroy() {
    this.stopTimer();
  }

  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  onOtpChange(otp: any) {
    debugger
    this.otp = otp;
  }

  setVal(val: any) {
    this.ngOtpInput.setValue(val);
  }

  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = '';
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }

  onEmailClick(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.otpForm.patchValue({
      email: inputElement.value
    })
  }
  onPhoneClick(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.otpForm.patchValue({
      email: inputElement.value
    })
  }

  varifyEmail() {
    this.otpForm.patchValue({
      otp: this.otp
    })

    this.authService.varifyOtp(this.otpForm.value)
      .subscribe(
        (response: any) => {

          if (response.status === true) {
            this.toastr.success('OTP Varified  Successfully!', 'Success!');
            this.signFormRider.patchValue({
              email: this.otpForm.value.email
            })
            this.modalService.dismissAll();
            // this._router.navigate(['/paymens-settings']);
            // const modalRef = this.modalService.open(this.sendOTPEmailTemplate, { size: 'md', windowClass: 'modal-md' });
          } else {
            if (response.message === "OTP not found or expired.") {
              console.log('OTP not found or expired.');
              // Handle the case when OTP is not found or expired
            } else {
              //  this.toasterService.showToast('error', "OTP not found or expired", "top-right", true);
              // console.log('Unexpected error:', response.message);
            }
          }

        },
        (er) => {
          // this.toasterService.showToast(er.error, "");
        }
      );

  }

  sendOtpPhone() {
    let param: any = {
      phoneNumber: this.pf['phoneNumber'].value
    }

    this.authService.sendOtpPhone(param)
      .subscribe(
        (res: any) => {
          if (res.status) {
            this.toastr.success('OTP Send  Successfully!', 'Success!');
            this.modalService.dismissAll();
            const modalRef = this.modalService.open(this.varifyOtpTemplate, { size: 'md', windowClass: 'modal-md' });
            this.email = false;
            this.phone = true;
          } else {
            this.toastr.error('OTP Not  Send!', 'Fail!');
            // this.toasterService.showToast('error', "OTP Not  Send", "top-right", true);
          }
        },
        (er) => {
          // this.toasterService.error(er.error, "Failed To Update");
        }
      );

  }

  varifyPhone() {

    debugger
    let param: any = {
      phoneNumber: this.pf['phoneNumber'].value,
      otp: this.otp
    }
    this.authService.varifyOtpPhone(param)
      .subscribe(
        (response: any) => {

          if (response.status === true) {
            this.toastr.success('OTP Varified  Successfully!', 'Success!');
            this.modalService.dismissAll();
            const modalRef = this.modalService.open(this.sendOTPEmailTemplate, { size: 'md', windowClass: 'modal-md' });
            // this.router.navigate(['/signUp']);
          } else {
            if (response.message === "OTP not found or expired.") {
              console.log('OTP not found or expired.');
              // Handle the case when OTP is not found or expired
            } else {
              this.toastr.error('OTP not found or expired!', 'Error!');
              //  this.toasterService.showToast('error', "OTP not found or expired", "top-right", true);
              // console.log('Unexpected error:', response.message);
            }
          }

        },
        (er) => {
          // this.toasterService.showToast(er.error, "");
        }
      );

  }


  onCountryChange(event: any): void {
    const defaultCountry = this.countries.find(country => country.name === event.value);
    this.signFormRider.patchValue({
      phoneCode: defaultCountry.phonecode,
    })
  }
  getForwardEmp() {
    this.signFormRider.patchValue({
      phone: Country.getAllCountries().filter(a => a.name == 'United States'),
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  }

  onTermsChange(event: any) {
    if (event.value) {
      this.openTermsDialog();
    }
  }

  openTermsDialog() {
    const dialogRef = this.dialog.open(TermsAndConditionsComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.signFormRider.get('termsAccepted')?.setValue(true);
      } else {
        this.signFormRider.get('termsAccepted')?.setValue(null);
      }
    });
  }

  saveRider() {
    const dateOfBirth = this.signFormRider.get('dateOfBirth')?.value;
    const formattedDate = this.formatDate(dateOfBirth);
    if (this.signFormRider.valid) {
      const formData = new FormData();
      formData.append('firstName', this.signFormRider.get('firstName')?.value);
      formData.append('middleName', this.signFormRider.get('middleName')?.value);
      formData.append('lastName', this.signFormRider.get('lastName')?.value);
      formData.append('email', this.signFormRider.get('email')?.value);
      formData.append('password', this.signFormRider.get('password')?.value);
      formData.append('ssn', this.signFormRider.get('ssn')?.value);
      formData.append('gender', this.signFormRider.get('gender')?.value);
      formData.append('phoneNumber', this.signFormRider.get('phoneNumber')?.value);
      formData.append('phoneCode', this.signFormRider.get('phoneCode')?.value);
      formData.append('country', this.signFormRider.get('country')?.value);
      formData.append('streetAddress', this.signFormRider.get('streetAddress')?.value);
      formData.append('city', this.signFormRider.get('city')?.value);
      formData.append('state', this.signFormRider.get('state')?.value);
      formData.append('zipCode', this.signFormRider.get('zipCode')?.value);
      formData.append('dateOfBirth', formattedDate);
      formData.append('signUpAs', this.signFormRider.get('signUpAs')?.value);
      this.selectedFiles.forEach(fileData => {
        formData.append(fileData.fieldName, fileData.file);
      });

      this.authService.saveRider(formData).subscribe({
        next: (response) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success', {timeOut: 2000});
            this._router.navigate(['/login'], { queryParams: { role: 'Rider' } });
          } else {

            this.toastr.error(response.message, 'Error', {timeOut: 2000});
          }
        },
        error: (error) => {
          if (error.status === 409) {
            this.toastr.warning(error.error.message, 'Conflict', {timeOut: 2000});
          } else {
            this.toastr.error('An unexpected error occurred.', 'Error', {timeOut: 2000});
          }
        },
        complete: () => {
        }
      })
    }
    else {
      this.toastr.warning('Please fill out the form correctly.', 'Warning');
    }
  }



  sendOtp() {
    this.authService.sendOtp(this.sendOtpForm.value)
      .subscribe(
        (res: any) => {
          if (res.status) {
            console.log("res", res.status)
            this.toastr.success('OTP Send  Successfully!', 'Success!');
            this.modalService.dismissAll();
            const modalRef = this.modalService.open(this.varifyOtpTemplate, { size: 'md', windowClass: 'modal-md' });
            this.email = true;
            this.phone = false;
            //  this._router.navigate(['/varify-otp'], { queryParams: { otp: this.f.email.value} });


            // this.reset();
          } else {
            // this.toasterService.showToast('error', "OTP Not Send ", "top-right", true);
          }
        },
        (er) => {
          // this.toasterService.error(er.error, "Failed To Update");
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

  reset() {
    this.createForm();
  }

  createFormEmail() {
    this.sendOtpForm = this.fb.group({
      email: [, []],
    })
  }
  createOtpForm() {
    this.otpForm = this.fb.group({
      otp: ['', []],
      email: ['', []],
    });
  }

  createOtpPhoneForm() {
    this.otpPhoneForm = this.fb.group({
      phoneNumber: ['', []],
      opt: ['', []],
    });
  }


  get pf() {
    return this.otpPhoneForm.controls;
  }

  createForm() {
    this.signFormRider = this.fb.group({
      id: [0, []],
      firstName: [, []],
      middleName: [, []],
      lastName: [, []],
      email: [, []],
      password: [, []],
      phoneCode: [, []],
      phoneNumber: [, []],
      country: [, []],
      ssn: [, []],
      gender: [, []],
      dateOfBirth: [, []],
      streetAddress: [, []],
      city: [, []],
      state: [, []],
      zipCode: [, []],
      signUpAs: ['Rider', []],
      picture: [, []],
      termsAccepted: [null]
    })
  }

  get formVal() {
    return this.signFormRider.value
  }

  get f() {
    return this.signFormRider.controls
  }

}