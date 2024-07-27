import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CoordinateFormatterService {

  private decimalPipe: DecimalPipe;

  constructor() {
    this.decimalPipe = new DecimalPipe('en-US');
   }

   numberCoordinates(
    coordinates: number[],
    fractionDigits: number = 0,
    template?: string, 
    ) {
        // Return an empty string if coordinates are undefined
      if (!coordinates || coordinates.length !== 2) {
        return '';
      }

    template = template || '{x} {y}';

    const x = coordinates[0];
    const y = coordinates[1];
    const digitsInfo = '1.' + fractionDigits + '-' + fractionDigits;
    const sX = this.decimalPipe.transform(x, digitsInfo);
    const sY = this.decimalPipe.transform(y, digitsInfo);
    return template.replace('{x}', sX || '').replace('{y}', sY || '');
   }
}
