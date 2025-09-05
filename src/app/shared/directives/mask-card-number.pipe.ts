import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCardNumber'
})
export class MaskCardNumberPipe implements PipeTransform {
  transform(cardNumber: string): string {
    if (!cardNumber || cardNumber.length !== 16) {
      return cardNumber;
    }
    
    const maskedSection = cardNumber.slice(0, 12).replace(/\d/g, '*');
    const visibleSection = cardNumber.slice(-4);
    
    return `${maskedSection}${visibleSection}`;
  }

}
