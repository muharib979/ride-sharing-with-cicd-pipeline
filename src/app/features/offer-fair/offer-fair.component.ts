import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-offer-fair',
  templateUrl: './offer-fair.component.html',
  styleUrl: './offer-fair.component.scss'
})
export class OfferFairComponent implements OnInit{
  offerForm: FormGroup;

  constructor(
    private fb: FormBuilder,private toast: NgToastService,
    private dialogRef: MatDialogRef<OfferFairComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.offerForm = this.fb.group({
      offer: ['', [Validators.required, Validators.min(0)]]
    });
  }
  ngOnInit(): void {
  }

  // submitOffer() {
  //   const maxOffer = this.data.price * 0.1; 
  //   if (
  //     this.offerForm.valid && this.offerForm.value.offer <= maxOffer) {
  //     this.dialogRef.close(this.offerForm.value.offer);
  //   }else{
  //     this.toast.danger("Offer Valid Upto 10%");

  //   }

  submitOffer() {
    console.log("offf",this.data.price)
    const maxOffer = this.data.price * 0.9; // Calculate 90% of the price
    if (
      this.offerForm.valid &&
      this.offerForm.value.offer >= maxOffer
    ) {
      this.dialogRef.close(this.offerForm.value.offer);
    } else {
      this.toast.danger("Offer Valid Upto 10%");
    }
  }
  
  
  
  

  closeDialog() {
    this.dialogRef.close();
  }
}