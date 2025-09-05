import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { passwordValidator } from '../../shared/Utility/password-validator';
import { AuthService } from '../../core/Services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent  implements OnInit {

  forgotPasswordForm!:FormGroup

  userId!:string

  constructor(private fb:FormBuilder,private authService:AuthService,
    private toastr: ToastrService,) { 
     
    }

  ngOnInit() {
    this.userId=localStorage.getItem('id') ?? '';
    console.log("user",this.userId)
    this.createform();
    // this.forgotPasswordForm = this.fb.group({
    //   password: ['', [Validators.required, passwordValidator()]],
    //   confirmPassword: ['', Validators.required]
    // }, { validators: this.passwordMatchValidator });
  }

  
  forgotPassword(){
    this.authService.forgotPassword(this.formVal)
    .subscribe(
    (res: any) => {
        if (res) {
          this.toastr.success('Password Change  Successfully!', 'Success!');
          this.reset();
        } else {
          this.toastr.error('Password Not Change!', 'Error!');
        }
      },
      (er) => {
        // this.toasterService.error(er.error, "Failed To Update");
      }
    );

  }

  reset(){
    this.createform();
  }

  createform(){
    this.forgotPasswordForm =this.fb.group({
      // userId:[this.userId,[]],
      password: ['', [Validators.required, passwordValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
   
  }

  get formVal(){
    return this.forgotPasswordForm.value
  }

  get password() {
    return this.forgotPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.forgotPasswordForm.get('confirmPassword');
  }

  passwordMatchValidator(group: FormGroup) {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null; // If either control is not found, don't perform validation
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    return password === confirmPassword ? password != confirmPassword : { passwordsMismatch: true };
  }

}

