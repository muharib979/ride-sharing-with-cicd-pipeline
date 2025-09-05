import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ride-details-with-price',
  templateUrl: './ride-details-with-price.component.html',
  styleUrl: './ride-details-with-price.component.scss'
})
export class RideDetailsWithPriceComponent implements OnInit {
 
  constructor( public dialogRef: MatDialogRef<RideDetailsWithPriceComponent>,@Inject(MAT_DIALOG_DATA) public data: { travelDuration: string ,travelDistance:string}) {}

  ngOnInit() {
    
  }
  

  rideOptions = [
    {
      name: 'VaaXY Value',
      time: '6 mins',
      arrivalTime: '11:22 PM',
      description: 'Cost effective, smooth ride, VaaXY-1 Ride Type',
      price: '691.31$',
      icon: 'path_to_uberx_icon',
    },
    {
      name: 'VaaXY Relax',  
      time: '5 mins',
      arrivalTime: '11:21 PM',
      description: 'Comfortable, smooth and cost more than Value ride, VaaXY-1, VaaXY-2 Ride',
      price: '823.56$',
      icon: 'path_to_premier_icon',
    },
    {
      name: 'VaaXY Elite',
      time: '2 mins',
      arrivalTime: '11:18 PM',
      description: 'Top level ride, cost more than Value & Relax, VaaXY-3',
      price: '61.18$',
      icon: 'path_to_moto_icon',
    },
    {
      name: 'VaaXY Pets',
      time: '2 mins',
      arrivalTime: '11:18 PM',
      description: 'Cost Extra, VaaXY-1, VaaXY-2, VaaXY-3',
      price: '361.18$',
      icon: 'path_to_moto_icon',
    },
  ];

  selectedRide: any;

  selectRide(ride: any) {
    this.selectedRide = ride;
  }

  requestRide() {
    if (this.selectedRide) {
      // Handle ride request logic here
      console.log('Requesting ride:', this.selectedRide);
    } else {
      console.log('Please select a ride');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
