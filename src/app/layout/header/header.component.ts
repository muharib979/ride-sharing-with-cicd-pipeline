import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TermsAndConditionsComponent } from '../../features/user/terms-and-conditions/terms-and-conditions.component';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  sendOtpForm?:FormGroup
  userName?: string;
  userId?: string;
  signUpAs?: string;
  picture?: string;
  isRTL?: boolean;
  
  public CalendarOpened: boolean = false;
 

  constructor( private fb: FormBuilder,private _router:Router,
    private dialog: MatDialog,public modalService: NgbModal,) {
    // this.isRTL = signUp.isRTL; 
  }

  ngOnInit() {
    this.userName = localStorage.getItem('firstName') ?? '';
    this.signUpAs = localStorage.getItem('signUpAs') ?? '';
    this.picture = localStorage.getItem('picture') ?? '';
    this.userId = localStorage.getItem('id') ?? '';
      console.log("login",this.picture)
    this.createForm();
  }




  scurityAndPasssword(){
    this._router.navigate(['/scurity-password']);
  }
  inbox(){
    this._router.navigate(['/inbox']);
  }
  profile(){
    this._router.navigate(['/profile']);
  }
  faceRecognition(){
    this._router.navigate(['/user-settings']);
  }
  userPreferences(){
    this._router.navigate(['/user-preferences']);
  }
  userSetup(){
    this._router.navigate(['/credit-card-setup']);
  }
  termsAndConditions(){
    this._router.navigate(['/accept-agrement']);
  }
  privacyStatements(){
    this._router.navigate(['/privacy-statements']);
  }
  helpAndSupport(){
    this._router.navigate(['/help-and-support']);
  }

  
  modalServOpen(event:any){
    this.modalService.open(event,{size: 'md', windowClass: 'modal-md'})
  }

  onSelectionChange(event: any) {
    const selectedRole = event.value;
    this._router.navigate(['/login'], { queryParams: { role: selectedRole } });
    this.modalService.dismissAll();
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
      this._router.navigate([route]);
      this.modalService.dismissAll();
    }
  }


  logout(){
    localStorage.removeItem('firstName');
    localStorage.removeItem('token');
    localStorage.removeItem('picture');
    localStorage.removeItem('id');
    // this._router.navigate(['/login']);
    this._router.navigate(['']);
    // this.signUp.redirect('/login');
    // this._router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     window.location.reload(); // Reload the page on navigation end
    //   }
    // });
  }

  openCalendar() {
    this.CalendarOpened = true;
  }
  closeCalendar(){
    this.CalendarOpened = false;
  }

 
  createForm() {
    this.sendOtpForm = this.fb.group({
      email: [, []],
    })
    }

    get f(){
      return this.sendOtpForm?.controls
    }

}