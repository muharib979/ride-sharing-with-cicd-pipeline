import { AfterViewInit, Component, ElementRef, OnInit, signal, TemplateRef, VERSION, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { Country, State, City } from 'country-state-city';
import { AuthService } from '../../core/Services/auth.service';
import { interval, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ImagePreviewDialogComponent } from '../image-preview-dialog/image-preview-dialog.component';


@Component({
  selector: 'app-sign-up-business',
  templateUrl: './sign-up-business.component.html',
  styleUrl: './sign-up-business.component.scss',
})
export class SignUpBusinessComponent implements OnInit,AfterViewInit {

  @ViewChild('country', {static: false}) country!: ElementRef
  @ViewChild('city', {static: false}) city!: ElementRef
  @ViewChild('state', {static: false}) state!: ElementRef;
  states: string[] = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  name = 'Angular ' + VERSION.major;
  public handleErrorRegister(controlName: string, errorName: string) {
    return (
      this.signUpFormbusiness.get(controlName)?.touched &&
      this.signUpFormbusiness.get(controlName)?.errors &&
      this.signUpFormbusiness.get(controlName)?.hasError(errorName)
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
  countries = Country.getAllCountries().filter(a => a.name=='United States');
  fileName: string = ''
  selectedFiles: { fieldName: string, file: File }[] = [];
  signUpFormbusiness!:FormGroup
  otpForm!: FormGroup;
  sendOtpForm!: FormGroup;
  otpPhoneForm!: FormGroup;
  email: boolean = false;
  phone: boolean = false;
  cities:any;
  private lastInserted: number[] = [];
  timeLeft: number = 60;
  intervalSubscription: Subscription | undefined;
  otp!: string;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  @ViewChild('sendOTPEmail', { static: false }) sendOTPEmailTemplate!: TemplateRef<any>;
  @ViewChild('varifyOtpTemplate', { static: false }) varifyOtpTemplate!: TemplateRef<any>;
  @ViewChild('sendOTPPhone', { static: false }) sendOTPPhoneTemplate!: TemplateRef<any>;



  constructor(

    private fb: FormBuilder,
    private dialog: MatDialog, private authService: AuthService,
    private router: Router, private toastr: ToastrService, public modalService: NgbModal

  ){

  }

  ngOnInit() {
    this.states;
    this.createForm();
    this.createFormEmail();
    this.createOtpForm();
    this.createOtpPhoneForm();
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
            this.signUpFormbusiness.patchValue({
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



  onFileSelected(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // this.setFileName(fieldName, file.name);
      const fileName = file.name;
      if (fieldName === 'businessLogo') {
        this.fileName = fileName;
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
    // this.dialog.open(ImagePreviewDialogComponent, {
    //   data: { imageSrc, fieldName }
    // });
    this.dialog.open(ImagePreviewDialogComponent, {
      data: { imageSrc, fieldName },
      // width: '500px',
      // height: '500px',
      // maxWidth: '80%',
      // maxHeight: '80%',
      // minWidth: '80%',
      // minHeight: '80%'
    });
  }

  
  saveBusiness() {
    if (this.signUpFormbusiness.valid) {
      const formData = new FormData();
      formData.append('businessName', this.signUpFormbusiness.get('businessName')?.value);
      formData.append('contactPerson', this.signUpFormbusiness.get('contactPerson')?.value);
      formData.append('contactPhoneNumber', this.signUpFormbusiness.get('contactPhoneNumber')?.value);
      formData.append('email', this.signUpFormbusiness.get('email')?.value);
      formData.append('password', this.signUpFormbusiness.get('password')?.value);
      formData.append('numOfEmp', this.signUpFormbusiness.get('numOfEmp')?.value);
      // formData.append('country', this.signUpFormbusiness.get('country')?.value);
      formData.append('businessPhoneNumber', this.signUpFormbusiness.get('businessPhoneNumber')?.value);
      formData.append('streetAddress', this.signUpFormbusiness.get('streetAddress')?.value);
      formData.append('city', this.signUpFormbusiness.get('city')?.value);
      formData.append('state', this.signUpFormbusiness.get('state')?.value);
      formData.append('zipCode', this.signUpFormbusiness.get('zipCode')?.value);
      formData.append('signUpAs', this.signUpFormbusiness.get('signUpAs')?.value);
      this.selectedFiles.forEach(fileData => {
        formData.append(fileData.fieldName, fileData.file);
      });

      this.authService.saveBusiness(formData).subscribe({
        next: (response) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success', {timeOut: 2000});
            this.router.navigate(['/login'], { queryParams: { role: 'Business' } });
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

  reset(){
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
    this.signUpFormbusiness = this.fb.group({
      id: [0, []],
      businessName: [, []],
      contactPerson: [, []],
      contactPhoneNumber: [, []],
      businessPhoneNumber: [, []],
      numOfEmp: [, []],
      email: [, []],
      password: [, []],
      businessLogo: [, []],
      streetAddress: [, []],
      city: [, []],
      state: [, []],
      zipCode: [, []],
      signUpAs: ['Business', []],
    })
  }

  get formVal(){
    return this.signUpFormbusiness.value
  }
}

