import { AfterViewInit, Component, ElementRef, OnInit, signal, TemplateRef, VERSION, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Country, State, City } from 'country-state-city';
import { AuthService } from '../../core/Services/auth.service';
import { ImagePreviewDialogComponent } from '../image-preview-dialog/image-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TermsAndConditionsComponent } from '../../features/user/terms-and-conditions/terms-and-conditions.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { Subscription, interval } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-sign-up-driver',
  templateUrl: './sign-up-driver.component.html',
  styleUrl: './sign-up-driver.component.scss',

})
export class SignUpDriverComponent implements OnInit,AfterViewInit {

  signFormDriver!: FormGroup
  otpForm!: FormGroup;
  sendOtpForm!: FormGroup;
  otpPhoneForm!: FormGroup;
  email: boolean = false;
  phone: boolean = false;

  @ViewChild('country', { static: false }) country!: ElementRef
  @ViewChild('city', { static: false }) city!: ElementRef
  @ViewChild('state', { static: false }) state!: ElementRef


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
      this.signFormDriver.get(controlName)?.touched &&
      this.signFormDriver.get(controlName)?.errors &&
      this.signFormDriver.get(controlName)?.hasError(errorName)
    );
  }

  

  name = 'Angular ' + VERSION.major;
  countries: any[] = [];
  fileName1: string = ''
  fileName2: string = ''
  fileName3: string = ''
  fileName4: string = ''
  fileName5: string = ''
  selectedFiles: { fieldName: string, file: File }[] = [];
  termsAccepted = false;
  cities: any;
  states: string[] = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  getGenderList: any[] = [{ id: 1, name: "Male" }, { id: 2, name: "Female" }, { id: 3, name: "He/She" }, { id: 4, name: "Others" }];
  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  isHovered = false;
  normalColor = '#3f51b5';  // default color
  hoverColor = '#000';    // hover color
  onMouseEnter() {
    this.isHovered = true;
  }
  onMouseLeave() {
    this.isHovered = false;
  }

  constructor(private fb: FormBuilder,
    private dialog: MatDialog, private authService: AuthService,
    private router: Router, private toastr: ToastrService,
     public modalService: NgbModal,private datePipe: DatePipe) {

  }

  ngOnInit() {
    this.countries = Country.getAllCountries();
    this.states
    this.createForm();
    this.createFormEmail();
    this.createOtpForm();
    this.createOtpPhoneForm();
    this.startTimer();
    let county = this.countries.filter(a => a.name == 'United States')
    this.signFormDriver.patchValue({
      country: county[0].name,
      phoneCode: county[0].phonecode,

    })
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

  setMonthAndYear(normalizedMonth: Date, datepicker: any) {
    const ctrlValue = this.signFormDriver.get('expirationDate')!.value!;
    ctrlValue.month(normalizedMonth.getMonth());
    ctrlValue.year(normalizedMonth.getFullYear());
    this.signFormDriver.get('expirationDate')!.setValue(ctrlValue);
    datepicker.close();
  }
  chosenYearHandler(normalizedYear: Date, datepicker: any) {
    // Get the current value or initialize it with today's date
    const ctrlValue = this.signFormDriver.get('expirationDate')?.value || new Date();
    ctrlValue.setFullYear(normalizedYear.getFullYear()); // Set the year
    this.signFormDriver.get('expirationDate')?.setValue(ctrlValue); // Update the form control with the new date
  }
  
  chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
    let ctrlValue = this.signFormDriver.get('expirationDate')?.value; 
    if (!ctrlValue) {
      ctrlValue = new Date();
    } 
    ctrlValue.setMonth(normalizedMonth.getMonth()); // Set the month
    this.signFormDriver.get('expirationDate')?.setValue(ctrlValue); // Update the form control with the new date
    datepicker.close(); // Close the date picker
  }
  // chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
  //   const currentYear = this.signFormDriver.get('expirationDate')?.value.getFullYear() || new Date().getFullYear();
  //   const formattedDate = new Date(currentYear, normalizedMonth.getMonth(), 1); // Set month and reset day to 1
  
  //   this.signFormDriver.get('expirationDate')?.setValue(formattedDate); // Set the formatted date
  
  //   // Optionally, format the displayed date
  //   const displayDate = `${('00' + (normalizedMonth.getMonth() + 1)).slice(-2)}${currentYear}`;
  //   this.signFormDriver.get('expirationDate')?.setValue(displayDate);
  
  //   datepicker.close();
  // }
  
  

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
            this.signFormDriver.patchValue({
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

  sendOtp() {
    this.authService.sendOtp(this.sendOtpForm.value)
      .subscribe(
        (res: any) => {
          if (res.status) {
            console.log("res", res.status)
            this.toastr.success('OTP Send  Successfully!', 'Success!');
            // this.toasterService.showToast('success', "OTP Send  Successfully", "top-right", true);
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

  onCountryChange(event: any): void {
    const defaultCountry = this.countries.find(country => country.name === event.value);
    this.signFormDriver.patchValue({
      phoneCode: defaultCountry.phonecode,
    })
  }

  getForwardEmp() {
    this.signFormDriver.patchValue({
      phone: Country.getAllCountries().filter(a => a.name == 'United States'),
    });
  }


  reset() {
    this.createForm();
  }

  onFileSelected(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // this.setFileName(fieldName, file.name);
      const fileName = file.name;

      if (fieldName === 'picture') {
        this.fileName1 = fileName;
      } else if (fieldName === 'licenseCopyFront') {
        this.fileName2 = fileName;
      }
      else if (fieldName === 'licenseCopyBack') {
        this.fileName3 = fileName;
      }
      else if (fieldName === 'vehicleCopy') {
        this.fileName4 = fileName;
      }
      else if (fieldName === 'insuranceCopy') {
        this.fileName5 = fileName;
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




  // setMonthDayAndYear(normalizedMonth: Moment, datepicker: any) {
  //   const ctrlValue = this.signFormDriver.get('dateOfBirth')!.value!;
  //   ctrlValue.month(normalizedMonth.month());
  //   ctrlValue.day(normalizedMonth.day());
  //   ctrlValue.year(normalizedMonth.year());
  //   this.signFormDriver.get('dateOfBirth')!.setValue(ctrlValue);
  //   datepicker.close();
  // }

  formatDateMMDDYYYY(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  }

  formatDateMMYYYY(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${month}${year}`;
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
        this.signFormDriver.get('termsAccepted')?.setValue(true);
      } else {
        this.signFormDriver.get('termsAccepted')?.setValue(null);
      }
    });
  }

  onSubmit() {
    const dateOfBirth = this.signFormDriver.get('dateOfBirth')?.value;
    const expirationDate = this.signFormDriver.get('expirationDate')?.value;
    const formattedDateMMDDYYYY = this.formatDateMMDDYYYY(dateOfBirth);
    const formattedDateMMYYYY = this.formatDateMMYYYY(expirationDate);
    if (this.signFormDriver.valid) {

      const formData = new FormData();
      formData.append('firstName', this.signFormDriver.get('firstName')?.value);
      formData.append('middleName', this.signFormDriver.get('middleName')?.value);
      formData.append('lastName', this.signFormDriver.get('lastName')?.value);
      formData.append('email', this.signFormDriver.get('email')?.value);
      formData.append('password', this.signFormDriver.get('password')?.value);
      formData.append('ssn', this.signFormDriver.get('ssn')?.value);
      formData.append('gender', this.signFormDriver.get('gender')?.value);
      formData.append('phoneNumber', this.signFormDriver.get('phoneNumber')?.value);
      formData.append('phoneCode', this.signFormDriver.get('phoneCode')?.value);
      formData.append('insurancePhoneNum', this.signFormDriver.get('insurancePhoneNum')?.value);
      formData.append('insuranceNumber', this.signFormDriver.get('insuranceNumber')?.value);
      formData.append('insuranceCompany', this.signFormDriver.get('insuranceCompany')?.value);
      formData.append('numberPlate', this.signFormDriver.get('numberPlate')?.value);
      formData.append('vehicleType', this.signFormDriver.get('vehicleType')?.value);
      formData.append('capacity', this.signFormDriver.get('capacity')?.value);
      formData.append('launchhYear', this.signFormDriver.get('launchhYear')?.value);
      formData.append('color', this.signFormDriver.get('color')?.value);
      formData.append('modal', this.signFormDriver.get('modal')?.value);
      formData.append('brand', this.signFormDriver.get('brand')?.value);
      formData.append('issuingState', this.signFormDriver.get('issuingState')?.value);
      formData.append('licenseType', this.signFormDriver.get('licenseType')?.value);
      formData.append('licenseNumber', this.signFormDriver.get('licenseNumber')?.value);
      formData.append('country', this.signFormDriver.get('country')?.value);
      formData.append('streetAddress', this.signFormDriver.get('streetAddress')?.value);
      formData.append('city', this.signFormDriver.get('city')?.value);
      formData.append('state', this.signFormDriver.get('state')?.value);
      formData.append('zipCode', this.signFormDriver.get('zipCode')?.value);
      formData.append('dateOfBirth', formattedDateMMDDYYYY);
      formData.append('expirationDate', formattedDateMMYYYY);
      formData.append('state', this.signFormDriver.get('state')?.value);
      formData.append('signUpAs', this.signFormDriver.get('signUpAs')?.value);
      this.selectedFiles.forEach(fileData => {
        formData.append(fileData.fieldName, fileData.file);
      });

      this.authService.saveDriver(formData).subscribe({
        next: (response) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success', {timeOut: 2000});
            this.router.navigate(['/login'], { queryParams: { role: 'Driver' } });
          } else {
            this.toastr.error(response.message, 'Error', {timeOut: 2000});
          }
        },
        error: (error) => {
          if (error.status === 409) {
            this.toastr.warning(error.error.message, 'Conflict', {timeOut: 2000});
          } else {
            this.toastr.error('An unexpected error occurred.', 'Error');
          }
        },
        complete: () => {
        }
      })
    }
    else {
      this.toastr.warning('Please fill out the form correctly.', 'Warning', {timeOut: 2000});
    }
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
    this.signFormDriver = this.fb.group({
      id: [0, []],
      firstName: [, []],
      middleName: [, []],
      lastName: [, []],
      email: ['', [Validators.required, Validators.email]],
      password: [, []],
      ssn: [, []],
      gender: [, []],
      phoneNumber: [, []],
      phoneCode: [, []],
      insurancePhoneNum: [, []],
      insuranceNumber: [, []],
      insuranceCompany: [, []],
      numberPlate: [, []],
      capacity: [, []],
      vehicleType: [, []],
      launchhYear: [, []],
      color: [, []],
      modal: [, []],
      brand: [, []],
      issuingState: [, []],
      licenseType: [, []],
      licensePaper: [, []],
      licenseNumber: [, []],
      licenseCopyFront: [, []],
      licenseCopyBack: [, []],
      insuranceCopy: [, []],
      vehicleCopy: [, []],
      country: [, []],
      dateOfBirth: [, []],
      expirationDate: [,[]],
      streetAddress: [, []],
      city: [, []],
      state: [, []],
      zipCode: [, []],
      signUpAs: ['Driver', []],
      termsAccepted: [null]

    })
  }



  get f() {
    return this.signFormDriver.controls;
  }

  get formVal() {
    return this.signFormDriver.value;
  }
}