import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/Services/auth.service';
import { passwordValidator } from '../../../shared/Utility/password-validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent  implements OnInit {

  changePasswordForm!:FormGroup

  userId?:string

  constructor(private fb:FormBuilder,private authService:AuthService,private toastr:ToastrService ) { }

  ngOnInit() {
    this.userId=localStorage.getItem('id') ?? '';
    this.createform();
  }

  
  changePassword(){
    this.authService.changePassword(this.formVal)
    .subscribe(
    (res: any) => {
        if (res) {
          this.toastr.success('Password Change  Successfullyy"!', 'Success!');
          this.reset();
        } else {
          this.toastr.success('Password Not Changed""!', 'Success!');
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
    this.changePasswordForm =this.fb.group({
      userId:[this.userId,[]],
      oldPassword:[,[]],
      newPassword: ['', [Validators.required, passwordValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
 
  }

  get formVal(){
    return this.changePasswordForm.value
  }

  get password() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
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