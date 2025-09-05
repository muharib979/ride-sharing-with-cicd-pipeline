import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/Services/auth.service';
import { UserModel } from '../../core/models/user-model';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit,AfterViewInit  {

  submitted = false;
  isLoading = false;
  credentials: any;
  sendOtpForm!: FormGroup;
  otpForm!: FormGroup;
  loginForm!: FormGroup;
  isUnAuthorize = false;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  @ViewChild('varifyOtpTemplate', { static: false }) varifyOtpTemplate!: TemplateRef<any>;
  @ViewChild('loginAs', { static: false }) loginAs!: TemplateRef<any>;

  timeLeft: number = 60;
  intervalSubscription: Subscription | undefined;
  otp!: string;
  showOtpComponent = true;
  public handleErrorRegister(controlName: string, errorName: string) {
    return (
      this.sendOtpForm.get(controlName)?.touched &&
      this.sendOtpForm.get(controlName)?.errors &&
      this.sendOtpForm.get(controlName)?.hasError(errorName)
    );
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public modalService: NgbModal,
    private route: ActivatedRoute
  ) {
    // this.appService.pageTitle = 'Login';
  }
  ngOnInit() {
    this.createLoginForm();
    this.createForm();
    this.createOtpForm();
    this.route.queryParams.subscribe(params => {
      this.loginForm.patchValue({
        signUpAs: params['role']
      });
    });
    this.startTimer();
  }

  ngAfterViewInit(): void {
    this.modalService.open(this.loginAs, { size: 'md', windowClass: 'modal-md' });
  }

  onSelectionChange(event: any) {
    const selectedRole = event.value;
    this.router.navigate(['/login'], { queryParams: { role: selectedRole } });
    this.modalService.dismissAll();
  }
  loginFormInvalid() {
    if (this.credentials.userName.length === 0) {
      return true;
    }
    if (this.credentials.password.length === 0) {
      return true;
    }
    return false;
  }

  login() {
    console.log("this.loginForm.value", this.loginForm.value);
    this.submitted = true;
    // if (this.loginFormInvalid()) {
    //   return;
    // }
    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe((data: any) => {
      if (data.token) {
        console.log("data", data)
        // this.router.navigate(['']);
        this.router.navigate(['/user']);
        // localStorage.setItem('isRemembered', this.credentials.rememberMe ? 'true' : 'false');
        localStorage.setItem('token', data.token);
        // localStorage.setItem('picture', data.user.picture);
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('id', data.id);
        localStorage.setItem('driverId', data.driverId);
        localStorage.setItem('signUpAs', data.signUpAs);
        localStorage.setItem('picture', data.picture);
        localStorage.setItem('pictureBase64', data.pictureBase64);
        // localStorage.setItem('assignedPages',JSON.stringify(data.user.assignedPages));
        // localStorage.setItem('loginID', data.user.loginID);
        let user = data as UserModel;
        if (this.credentials) {
          // localStorage.setItem('loginID', user.loginID);
          localStorage.setItem('firstName', user.firstName ?? '');
          localStorage.setItem('signUpAs', user.signUpAs ?? '');
          localStorage.setItem('picture', user.picture ?? '');
          localStorage.setItem('pictureBase64', user.pictureBase64 ?? '');
          localStorage.setItem('userID', user.id?.toString() ?? '');
          localStorage.setItem('driverId', user.driverId?.toString() ?? '');
          // localStorage.setItem('userTypeID', user.userTypeID.toString());
          localStorage.setItem('empCode', user.empCode ?? '');
          // localStorage.setItem('picture', user.picture);
          // localStorage.setItem('gradeValue', user.gradeValue.toString());
          // localStorage.setItem('companyID', user.companyID.toString());
          localStorage.setItem('locked', 'false');
        } else {
          // this.toasterService.showToast('error', "Username Or Password InCorrect!", "top-right", true);
          // sessionStorage.setItem('loginID', user.loginID);
          // sessionStorage.setItem('userName', user.userName);
          // sessionStorage.setItem('userID', user.id.toString());
          // sessionStorage.setItem('userTypeID', user.userTypeID.toString());
          // sessionStorage.setItem('empCode', user.empCode);
          // sessionStorage.setItem('picture', user.picture);
          // sessionStorage.setItem('gradeValue', user.gradeValue.toString());
          // sessionStorage.setItem('companyID', user.companyID.toString());
          sessionStorage.setItem('locked', 'false');
        }


        this.isLoading = false;
        // this.authService.redirect('');
        // this.router.navigate(['']);
        this.toastr.success('WellCome VaaXY!', '', { timeOut: 1500 });
        this.router.navigate(['/user']);
      }
    }, () => {
      this.toastr.error('Username Or Password is InCorrect!', 'InCorrect!', { timeOut: 2000 });
      // this.router.navigate(['/signUp']);
      this.isLoading = false;
      this.isUnAuthorize = true;
    });
  }

  logout() {
    // this.authService.logout(this.loginID)
    //   .subscribe((response: any) => {
    //     if (localStorage.getItem('isRemembered') == 'true') {
    localStorage.removeItem('firstName');

  }

  clearErrMsg() {
    this.isUnAuthorize = false;
  }

  modalServOpen(event: any) {
    this.modalService.open(event, { size: 'md', windowClass: 'modal-md' })
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


  sendOtp() {
    this.authService.sendOtpAndCheckEmail(this.formVal)
      .subscribe(
        (res: any) => {
          if (res.status == true) {
            debugger
            console.log("res", res.status)
            this.toastr.success('OTP Send  Successfully!', 'Success!');
            this.otpForm.patchValue({
              email:this.formVal.email
            })
            this.modalService.dismissAll();
            const modalRef = this.modalService.open(this.varifyOtpTemplate, { size: 'md', windowClass: 'modal-md' });
            // this.reset();
          }

          else {
            this.toastr.error('OTP Not Send!', 'Error!');
          }
        },
        (er) => {
          if (er.status == 404) {
            this.toastr.error('Email not found!', 'InCorrect!');
          }
        }
      );

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
            this.modalService.dismissAll();
            this.router.navigate(['/forgot-password'])
          } else {
            if (response.message === "OTP not found or expired.") {
              this.toastr.error('OTP not found or expired!', 'Error!');
            } else {
              this.toastr.error('OTP not found or expired!', 'Error!');
              // console.log('Unexpected error:', response.message);
            }
          }
        },
        (er) => {
          this.toastr.error('er.error!', 'Error!');
        }
      );

  }

  onSignUpSelectionChange(event: any) {
    const selectedRole = event.value;
    let route = '';

    switch (selectedRole) {
      case 'Rider':
        route = '/sign-up';
        break;
      case 'Driver':
        route = '/signUp-driver';
        break;
      case 'Business':
        route = '/signUp-business';
        break;
      default:
        break;
    }

    if (route) {
      this.router.navigate([route]);
      this.modalService.dismissAll();
    }
  }

 

  createForm() {
    this.sendOtpForm = this.fb.group({
      email: [, []],
      signUpAs: [, []],
    })
  }

  createOtpForm() {
    this.otpForm = this.fb.group({
      otp: ['', []],
      email: ['', []],
    });
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      userName: [, []],
      password: [, []],
      signUpAs: [, []],
    })
  }

  get f() {
    return this.sendOtpForm.controls
  }
  get formVal() {
    return this.sendOtpForm.value
  }
}
