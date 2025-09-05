import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.scss'
})
export class DriverComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit() {
  }

  signUpDriver(){
    this._router.navigate(['/signUp-driver']);
  }
}
