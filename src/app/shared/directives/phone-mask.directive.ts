import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective  {
  constructor(public ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove all non-digit characters

    // Limit input to 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    // Apply formatting
    if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{1,4})$/, '$1-$2-$3');
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{1,3})$/, '$1-$2');
    }

    // Set the formatted value back to the form control
    this.ngControl.control?.setValue(value, { emitEvent: false });
  }
}
