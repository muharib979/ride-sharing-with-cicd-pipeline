import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent  implements OnInit {

  isAccepted: boolean = false;
  constructor(private router:Router) { }

  ngOnInit() {
  }

  onAccept() {
     this.router.navigate(['/signUp']);
    // alert('You have accepted the terms and conditions.');
    // Perform any other action on acceptance
  }

}
