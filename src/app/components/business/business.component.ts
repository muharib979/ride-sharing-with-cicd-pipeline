import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss'
})
export class BusinessComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit() {
  }

    signUpBusiness(){
      this._router.navigate(['/signUp-business']);
    }
  }

