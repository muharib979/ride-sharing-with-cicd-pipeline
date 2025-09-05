import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreditCardModel } from '../../core/models/credit-card-model';
import { UserSettingsService } from '../../core/Services/user-settings.service';

@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrl: './payment-settings.component.scss'
})
export class PaymentSettingsComponent implements OnInit {


  creditCardForm!: FormGroup;
  getAllCardTypeList: any[] = [{ id: 1, cardName: "VISA" }, { id: 2, cardName: "Mastercard" }, { id: 3, cardName: "Discover" }];
  states: string[] = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

  userId!: string
  getUserDetailsItem: any[] = [];
  getCreditCardData: CreditCardModel[] = [];

  decodeBase64(encodedString: string): string {
    return atob(encodedString);
  }

  constructor(private fb: FormBuilder, 
    private userSetting: UserSettingsService, private _router: Router,private toastr:ToastrService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('id') ?? '';
    this.states;
    this.getCreditCardInfo();
    this.createform();
  }
  // convertToBase64(byteArray: Uint8Array): string {
  //   return btoa(String.fromCharCode.apply(null, Array.from(byteArray)));
  // }

  convertToBase64(cardNumber: string): string {
    const first12Digits = cardNumber.slice(0, 12).replace(/-/g, '');
    const last4Digits = cardNumber.slice(-4);
    const base64First12 = btoa(first12Digits);
    return base64First12 + last4Digits;
  }
  
  convertToBase64CardSecurityCode(cardNumber: string): string {
    const first12Digits = cardNumber.slice(0, 2).replace(/-/g, '');
    const last4Digits = cardNumber.slice(-2);
    const base64First12 = btoa(first12Digits);
    return base64First12 + last4Digits;
  }

  maskCardNumber(base64CardNumber: string): string {
    const maskedPart = '************';
    const last4Digits = base64CardNumber.slice(-4);
    return maskedPart + last4Digits;
  }

  maskcardSecurityCode(base64CardNumber: string): string {
    const maskedPart = '**';
    const last4Digits = base64CardNumber.slice(-4);
    return maskedPart + last4Digits;
  }

  creditCardSetup() {
    const cardNumber = this.creditCardForm.value.cardNumber;
    // const cardSecurityCode = this.creditCardForm.value.cardSecurityCode;
    this.creditCardForm.patchValue({
      cardNumber: this.convertToBase64(cardNumber),
      // cardSecurityCode: this.convertToBase64(cardSecurityCode)
    })
    this.userSetting.creditCardSetup(this.formVal)
      .subscribe(
        (res: any) => {
          if (res) {
            this.toastr.success('Payment Settings Save  Successfully"!', 'Success!');
            // this.reset();
          } else {
            this.toastr.error('Payment Settings Not Save "!', 'Success!');
            // this.toasterService.showToast('error', "Credit Card Not Setup ", "top-right", true);
          }
        },
        (er) => {
          // this.toasterService.error(er.error, "Failed To Update");
        }
      );

  }

  reset() {
    this.createform();
  }

  getProfile() {
    this.userSetting.getProfileDriver(this.userId).subscribe((response: any) => {
      if (response) {
        this.getUserDetailsItem = response as any[];
        let data = this.getUserDetailsItem[0];
        this.creditCardForm.patchValue(data)
        console.log("datasds", this.getUserDetailsItem)
      } else {
        this.getUserDetailsItem = [];
      }

    })
  }
  decodedText: string = '';

  getCreditCardInfo() {
    this.userSetting.getCreditCardInfo(this.userId).subscribe((response: CreditCardModel) => {
      if (response) {
        this.getCreditCardData = response as CreditCardModel[];
        console.log("ddd", this.getCreditCardData)
        this.creditCardForm.patchValue(this.getCreditCardData)
        let date: Date = new Date(this.formVal.expirationDate);
        this.creditCardForm.patchValue({
          expirationDate: date
        })
        this.creditCardForm.patchValue({
          cardNumber: this.maskCardNumber(this.formVal.cardNumber),
          // cardSecurityCode: this.maskcardSecurityCode(this.formVal.cardSecurityCode)
        })

      } else {
        this.getCreditCardData = [];
      }

    })
  }

  onToggleChanged(field: string, event: CustomEvent) {
    this.creditCardForm.get(field)?.setValue(event.detail.checked ? 1 : 0);
    if (event.detail.checked == 1) {
      this.getProfile();
    } else {
      this.creditCardForm.patchValue({
        streetAddress: '',
        city: '',
        state: '',
        zipCode: ''
      })
    }
  }


  createform() {
    this.creditCardForm = this.fb.group({
      id: [0, []],
      userId: [this.userId, []],
      cardholderName: [, []],
      cardNumber: ['', []],
      expirationDate: ['',],
      cardType: ['0', []],
      cardSecurityCode: ['', []],
      streetAddress: ['', []],
      city: ['', []],
      state: ['', []],
      zipCode: ['', []],
      sameAs: ['', []],
    })
  }

  get formVal() {
    return this.creditCardForm.value
  }

}