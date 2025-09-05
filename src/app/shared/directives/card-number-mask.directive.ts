import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCardNumberMask]'
})
export class CardNumberMaskDirective {

  constructor(public ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove all non-digit characters

    // Limit input to 16 digits
    if (value.length > 16) {
      value = value.slice(0, 16);
    }

    // Apply formatting based on the length of the input
    if (value.length > 4) {
      value = value.replace(/^(\d{4})(\d)/, '$1-$2');
    }
    if (value.length > 8) {
      value = value.replace(/^(\d{4})-(\d{4})(\d)/, '$1-$2-$3');
    }
    if (value.length > 12) {
      value = value.replace(/^(\d{4})-(\d{4})-(\d{4})(\d)/, '$1-$2-$3-$4');
    }

    // Set the formatted value back to the form control
    this.ngControl.control?.setValue(value, { emitEvent: false });
  }
}


