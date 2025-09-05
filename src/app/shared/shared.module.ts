import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { SsnMaskDirective } from './directives/ssn-mask.directive';
import { CardNumberMaskDirective } from './directives/card-number-mask.directive';
import { MaskCardNumberPipe } from './directives/mask-card-number.pipe';



@NgModule({
  declarations: [
    PhoneMaskDirective,
    SsnMaskDirective,
    CardNumberMaskDirective,
    MaskCardNumberPipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports:[
    PhoneMaskDirective,
    SsnMaskDirective,
    CardNumberMaskDirective,
    MaskCardNumberPipe
  ]
})
export class SharedModule { }
