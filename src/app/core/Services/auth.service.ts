import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  saveRider(formData: FormData): Observable<any>  {
    return this.http.post(environment.apiUrl + 'signUp-rider', formData);
  }
  saveDriver(formData: FormData): Observable<any>  {
    return this.http.post(environment.apiUrl + 'signUp-driver', formData);
  }

  saveBusiness(formData: FormData): Observable<any>  {
    return this.http.post(environment.apiUrl + 'signUp-business', formData);
  }

   login(credentials: any) {
    // const paramObj = new HttpParams()
    //   .set('userName', credentials.userName)
    //   .set('password', credentials.password);
    // const header = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this.http.post(environment.apiUrl + 'login', credentials);
  }

  redirect(url: string) {
    this.router.navigate([url]);
  }

  changePassword(password: any) {
    return this.http.post(environment.apiUrl + 'change-password', password);
  }

  forgotPassword(password: any) {
    return this.http.post(environment.apiUrl + 'forgot-password', password);
  }

  get isRTL() {
    return document.documentElement.getAttribute('dir') === 'rtl' ||
      document.body.getAttribute('dir') === 'rtl';
  }

  sendOtp(email: any) {
    return this.http.post(environment.apiUrl + 'send-otp-email', email);
  }
  sendOtpPhone(phoneNumber: any) {

    return this.http.post(environment.apiUrl + 'send-otp-phone', phoneNumber);
  }
  varifyOtp(otp: any) {
    return this.http.post(environment.apiUrl + 'verify-otp-email', otp);
  }
  varifyOtpPhone(otp: any) {
    return this.http.post(environment.apiUrl + 'verify-otp-phone', otp);
  }
  
  sendOtpAndCheckEmail(data:any){
    debugger
    return this.http.post(environment.apiUrl+'send-otp-email-with-checkEmail',data); 
  }
}
