import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSsnMask]'
})
export class SsnMaskDirective {
  constructor(public ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove all non-digit characters

    // Limit input to 9 digits
    if (value.length > 9) {
      value = value.slice(0, 9);
    }

    // Apply formatting
    if (value.length > 5) {
      value = value.replace(/^(\d{3})(\d{2})(\d{1,4})$/, '$1-$2-$3'); // Add hyphens
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{1,2})$/, '$1-$2'); // Add hyphen after first 3 digits
    }

    // Set the formatted value back to the form control
    this.ngControl.control?.setValue(value, { emitEvent: false });
  }
}