import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GoogleMap, MapDirectionsService } from '@angular/google-maps';
import { BehaviorSubject, map } from 'rxjs';
import { PlaceSearchResult } from '../place-and-time/place-and-time.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RideDetailsWithPriceComponent } from '../ride-details-with-price/ride-details-with-price.component';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/Services/notification.service';
import { RiderService } from '../../core/Services/rider.service';
import { RiderInfoModel } from '../../core/models/rider-info-model';
import { ProfileModel } from '../../core/models/profile-model';
import { UserSettingsService } from '../../core/Services/user-settings.service';
import { NotifyService } from '../../core/Services/notify.service';
import { DriverInfoModel } from '../../core/models/driver-info-model';
import { OfferFairComponent } from '../../features/offer-fair/offer-fair.component';
import { NgToastService } from 'ng-angular-popup';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrl: './map-display.component.scss'
})
export class MapDisplayComponent implements OnInit, AfterViewInit {
  shedulerForm!: FormGroup;
  dialogRef!: MatDialogRef<any>;
  @ViewChild('map', { static: true })
  map!: GoogleMap;
  userId!: string;
  picture!: string;
  userName!: string;
  picture64!: string;
  @Input() from: PlaceSearchResult | undefined;
  @Input() to: PlaceSearchResult | undefined;
  @Input() isSheduler: boolean | undefined;
  mapShowLarge: boolean = true;
  mapShowWithdetails: boolean = false;
  showSheduler: boolean = false;
  rideOptions: any[] = [];

  pointsAround1Km: any;


  riderInfoItem: any[] = [];
  markerPositions: google.maps.LatLng[] = [];
  zoom = 5;
  trafficLayer!: google.maps.TrafficLayer;
  directionsResult$ = new BehaviorSubject<
    google.maps.DirectionsResult | undefined
  >(undefined);
  distance: string | undefined;
  offerPrice!: string | undefined;
  totalDistance!: number;
  vaaxyDriverRate!: number;
  discountPrice!: string;
  vaaxyRelaxz!: string | undefined;
  vaazyElite!: string | undefined;
  vaazyPets!: string | undefined;
  price: string | undefined;
  travelDuration!: string | undefined;
  totalMinutes!: number;
  directionsService = new google.maps.DirectionsService();
  driversList: any[] = [];
  driverIds: any[] = [];

  carIcon: google.maps.Symbol = {
    // path: "M 1.5 1.5 L 3 1.5 L 4 2 L 4.5 2.5 L 4.5 3 L 0.5 3 L 0.5 2.5 L 1 2 Z M 1 2 L 1.5 1.5 L 3 1.5 L 3.5 2 L 1 2 Z M 1.5 1 L 2.5 1 L 2.5 1.5 L 1.5 1.5 Z M 1 2.5 L 1.5 2.5 L 1.5 3 L 1 3 Z M 3.5 2.5 L 4 2.5 L 4 3 L 3.5 3 Z",
    path: "M 1.5 1.5 L 3 1.5 L 4 2 L 4.5 2.5 L 4.5 3 L 0.5 3 L 0.5 2.5 L 1 2 Z M 1 2 L 1.5 1.5 L 3 1.5 L 3.5 2 L 1 2 Z  M 1 2.5 L 1.5 2.5 L 1.5 3 L 1 3 Z M 3.5 2.5 L 4 2.5 L 4 3 L 3.5 3 Z",
    scale: 10, // Adjust as necessary
    fillColor: "#FF5733", // Bright color for a sports car feel
    fillOpacity: 1,
    strokeColor: "#000000", // Black outline for contrast
    strokeWeight: 1
  };








  // carIcon: string = 'assets/images/carInMap.png'; // Replace with your car icon image path





  getCustomMarkerIcon(): google.maps.Icon {
    return {
      url: 'assets/images/carInMap.png', // Path to your custom car image
      scaledSize: new google.maps.Size(70, 70), // Adjust size if necessary
    };
  }


  constructor(private directionService: MapDirectionsService, public dialog: MatDialog, private sharedService: RiderService,
    private _router: Router, private notificationService: NotificationService, private userService: UserSettingsService,
    private signalrService: NotifyService, private toast: NgToastService, private cdr: ChangeDetectorRef, private fb: FormBuilder
  ) {


  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('firstName') ?? '';
    this.picture = localStorage.getItem('picture') ?? '';
    this.picture64 = localStorage.getItem('pictureBase64') ?? '';
    // this.getImage();
    this.userId = localStorage.getItem('id') ?? '';
    this.sharedService.buttonClick$.subscribe(() => {
      this.onButtonClick();
    });
 
    this.getProfile();
    this.pickupForm();
    if(this.isSheduler == true){
      this.shedulerForm.patchValue({pickupDateTime: new Date().toISOString()})
    }else{
      this.shedulerForm.patchValue({pickupDateTime: null})
    }
    // this.calculateExtraMinutes(this.totalDistance, this.totalMinutes)

  }

  ngAfterViewInit(): void {
    if (this.map && this.map.googleMap) {
      this.trafficLayer = new google.maps.TrafficLayer();
      this.trafficLayer.setMap(this.map.googleMap!); // Attach traffic layer
    }
  }

  checkUserId() {
    if (!this.userId) {
      this._router.navigate(['/login']);
    } else {

    }
  }

  ngOnChanges() {
    // this.runLocationLogic();
  }
  runLocationLogic() {
    const fromLocation = this.from?.location;
    const toLocation = this.to?.location;
    if (fromLocation && toLocation) {
      this.getDirections(fromLocation, toLocation);
      // this.getNearbyLocations();
      // this.calculateDistance(fromLocation, toLocation);
      // Calculate distance
    }
    // else if (fromLocation) {
    //   this.gotoLocation(fromLocation);
    // } 
    else if (toLocation) {
      this.gotoLocation(toLocation);
    }
  }
  onButtonClick() {
    this.runLocationLogic();
  }

  gotoLocation(location: google.maps.LatLng) {
    this.markerPositions = [location];
    this.map.panTo(location);
    // console.log("map",location.lat(),location.lng())
    this.zoom = 17;
    this.directionsResult$.next(undefined);
  }


  getDirections(

    fromLocation: google.maps.LatLng,
    toLocation: google.maps.LatLng
  ) {
    const request: google.maps.DirectionsRequest = {
      destination: toLocation,
      origin: fromLocation,
      travelMode: google.maps.TravelMode.DRIVING,
    };
    console.log("map", fromLocation.lat(), fromLocation.lng())

    this.directionService
      .route(request)
      .pipe(map((response) => response.result))
      .subscribe((res:any) => {
        this.directionsResult$.next(res);
        this.markerPositions = [];

        if (res.routes && res.routes.length > 0) {
          const duration = res.routes[0].legs[0].duration?.text; // Get duration in a readable format
          console.log("Estimated travel time:", duration);
               // Extract hours and minutes from the text
        const hourMatch = duration.match(/(\d+)\s*hour/); // Match "1 hour"
        const minuteMatch = duration.match(/(\d+)\s*mins?/); // Match "2 mins"

        // Convert matched values to numbers, default to 0 if not found
        const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
        const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;

        // Construct the desired format
        this.travelDuration = `${hours}:${minutes}`;
        this.totalMinutes = hours * 60 + minutes;
        console.log('Total Minutes:', this.totalMinutes);        
          // You can save it to a variable or display it in the UI
          this.travelDuration = duration;
          this.calculateDistance(fromLocation, toLocation)
        }
      });
    this.getNearbyLocation(fromLocation.lat(), fromLocation.lng());

  }

  getNearbyLocation(lat: number, lng: number) {
    this.notificationService.getNearLocation(lat, lng).subscribe((response: any) => {
      // this.drivers = response;
      // console.log("rrrr",this.drivers)
      if (response) {
        this.driversList = response;
        this.driverIds = this.driversList.map((driver: any) => driver.driverId);
        console.log("driverList", this.driversList)
      }
      else {
        this.toast.info("There are no cars found in nearby", "WARNING", 3000)

        this.driversList = [];
      }

    })
  }


  calculateExtraMinutes(distance: number, actualTime: number): number {
    const estimatedTime = distance * 1; // Assuming 1 mile = 1 minute
    const extraTime = actualTime - estimatedTime; // Calculate the extra minutes
    return extraTime;
  }
  // Method to calculate the distance between fromLocation and toLocation
  calculateDistance(fromLocation: google.maps.LatLng, toLocation: google.maps.LatLng) {
    const distanceService = new google.maps.DistanceMatrixService();

    distanceService.getDistanceMatrix(
      {
        origins: [fromLocation],
        destinations: [toLocation],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL, // Use Imperial to get miles, use METRIC for kilometers
      },
      (response: any, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          const results = response.rows[0].elements[0];
          let distanceText = results.distance?.text; // e.g., "30 mi" or "48 km"
          let distanceValue = results.distance?.value; // value in meters

          if (distanceText && distanceValue) {
            const isMiles = distanceText.includes("mi"); // Check if the unit is miles
            const rawDistance = parseFloat(distanceText); // Extract the numerical part
            this.totalDistance = rawDistance;
           const extraMinutes = this.calculateExtraMinutes(this.totalDistance, this.totalMinutes);

            // console.log(`For a distance of ${this.totalDistance} miles, the extra time taken is ${extraMinutes} minutes.`);
            if (isMiles) {
              // const customDistance = rawDistance * 2.25;
              const customDistance = this.totalDistance * 2.25 + extraMinutes * .35;
              // Perform the custom conversion
              const vaaxyRelaxz = customDistance * 1.10;
              const vaaxyElite = customDistance * 1.30;
              const vaaxyPets = customDistance * 1.35;
              this.distance = `${customDistance.toFixed(2)}`;
              // this.offerPrice = customDistance.toFixed(2);
              console.log("ddd",this.offerPrice);
              this.vaaxyRelaxz = `${vaaxyRelaxz.toFixed(2)}`;
              this.vaazyElite = `${vaaxyElite.toFixed(2)}`;
              this.vaazyPets = `${vaaxyPets.toFixed(2)}`;
              this.setRideOptions();
            } else {
              // If the distance is in kilometers, handle it separately if needed
              this.distance = distanceText; // Keep it as kilometers if required
            }

          }
          this.checkAndOpenDialog();
        }
      }
    );
  }

  // calculateDistance(fromLocation: google.maps.LatLng, toLocation: google.maps.LatLng) {
  //   const distanceService = new google.maps.DistanceMatrixService();

  //   distanceService.getDistanceMatrix(
  //     {
  //       origins: [fromLocation],
  //       destinations: [toLocation],
  //       travelMode: google.maps.TravelMode.DRIVING,
  //       unitSystem: google.maps.UnitSystem.IMPERIAL, // Use IMPERIAL for miles, METRIC for kilometers
  //     },
  //     (response:any, status) => {
  //       if (status === google.maps.DistanceMatrixStatus.OK) {
  //         const results = response.rows[0].elements[0];
  //         const distanceText = results.distance?.text; // e.g., "4.7 mi" or "7.5 km"
  //         // this.distance = distanceText;
  //         // console.log("this.distance = distanceText",this.distance = distanceText)
  //         let distanceValue = results.distance?.value; // value in meters

  //         if (distanceText && distanceValue) {
  //           const isMiles = distanceText.includes("mi"); // Check if the unit is miles
  //           const rawDistance = parseFloat(distanceText); // Extract the numerical part

  //           if (isMiles) {
  //             let customDistance = 0;

  //             if (rawDistance > 30) {
  //               // If distance is greater than 30 miles
  //               const first30Miles = 30 * 2.25;
  //               const above30Miles = (rawDistance - 30) * 2.65;
  //               customDistance = first30Miles + above30Miles;
  //             } else {
  //               // If distance is less than or equal to 30 miles
  //               customDistance = rawDistance * 2.25;
  //             }

  //             this.distance = `${customDistance.toFixed(2)}($)`; // Display the result
  //           } else {
  //             // If the distance is in kilometers, handle separately if needed
  //             this.distance = distanceText; // Keep it as kilometers if required
  //           }
  //           this.checkAndOpenDialog();
  //         }

  //       }
  //     }
  //   );

  // }

  getProfile() {
    this.userService.getProfile(this.userId).subscribe(
      (response: ProfileModel) => {
        if (response) {
          this.riderInfoItem = [response];
          let data = this.riderInfoItem[0];
          console.log("ff", data)
          // if (data.dateOfBirth) {
          //   data.dateOfBirth = this.convertToDate(data.dateOfBirth);
          // }
        } else {
          this.riderInfoItem = [];
        }
      },
      (error) => {
        console.error("Error fetching profile data", error);
      }
    );
  }

  checkAndOpenDialog() {
    this.checkUserId(); // First, check if the user is logged in
    if (this.userId && this.distance || this.travelDuration) {
      // Only open the dialog if the user is logged in and both travelDuration and distance exist
      // this.openDialog();
      this.mapShowWithdetails = true;
      this.mapShowLarge = false;
    }
  }

  // rideDiscount:this.discountPrice,
  resetRiderInfo(): RiderInfoModel {
    return {
      riderId: 0,
      riderName: '',
      phoneNumber: '',
      gender: '',
      from: '',
      to: '',
      ridePrice: '',
      distance: 0,
      address: '',
      preferCar: '',
      picture: '',
      pictureBase64: ''
    };
  }


  sendRiderRequest() {
    console.log("rider", this.formVal.pickupDateTime)
    const from = "" + this.from?.address;
    const to = "" + this.to?.address;
    // this.vaaxyDriverRate = this.totalDistance *.80
    const riderInfoList: RiderInfoModel[] = [
      {
        riderId: this.riderInfoItem[0].riderId,
        riderName: this.userName,
        phoneNumber: '123-456-7890',
        gender: 'Male',
        from: from,
        to: to,
        ridePrice: this.vaaxyDriverRate.toFixed(2),
        distance: this.totalDistance,
        address: '123 Main St',
        preferCar: 'Sedan',
        picture: this.picture,
        pictureBase64: this.picture64,
        pickupTime: this.formVal.pickupDateTime !== null
          ? this.formVal.pickupDateTime
          : 'Now'

      }
    ];

    this.notificationService.sendNotification(riderInfoList, this.driverIds).subscribe(
      response => {
        this.toast.success("Notification sent successfully to drivers", "SUCCESS", 3000)
        this.resetRiderInfo();

      },
      error => {
        // console.error('Error sending notification', error);
        this.toast.danger("Error sending notification");
      }
    );
  }


  openDialog(): void {
    this.dialogRef = this.dialog.open(RideDetailsWithPriceComponent, {
      width: '500px',
      maxHeight: '80vh',
      data: { travelDuration: this.travelDuration, travelDistance: this.distance }
    });
  }

  // closeDialog(): void {
  //   if (this.dialogRef) {
  //     this.dialogRef.close();
  //     console.log('Dialog closed');
  //   }
  // }


  // rideOptions = [
  //   {
  //     name: 'VaaXY Value',
  //     time: '6 mins',
  //     arrivalTime: '11:22 PM',
  //     description: 'Cost effective, smooth ride, VaaXY-1 Ride Type',
  //     price: this.distance,
  //     icon: 'path_to_uberx_icon',
  //   },
  //   {
  //     name: 'VaaXY Relax',  
  //     time: '5 mins',
  //     arrivalTime: '11:21 PM',
  //     description: 'Comfortable, smooth and cost more than Value ride, VaaXY-1, VaaXY-2 Ride',
  //     price:this.vaaxyRelaxz,
  //     icon: 'path_to_premier_icon',
  //   },
  //   {
  //     name: 'VaaXY Elite',
  //     time: '2 mins',
  //     arrivalTime: '11:18 PM',
  //     description: 'Top level ride, cost more than Value & Relax, VaaXY-3',
  //     price: 4.18,
  //     icon: 'path_to_moto_icon',
  //   },
  //   {
  //     name: 'VaaXY Pets',
  //     time: '2 mins',
  //     arrivalTime: '11:18 PM',
  //     description: 'Cost Extra, VaaXY-1, VaaXY-2, VaaXY-3',
  //     price: 3.18,
  //     icon: 'path_to_moto_icon',
  //   },
  // ];

  setRideOptions() {
    // Set distance and vaaxyRelaxz values as needed here
    // this.distance = this.calculateDistance(); // Assume a method that calculates distance
    // this.vaaxyRelaxz = this.distance * 1.10;  // 10% more than the distance value

    // Define rideOptions using these values
    this.rideOptions = [
      {
        name: 'VaaXY Value',
        time: '6 mins',
        arrivalTime: '11:22 PM',
        description: 'Cost effective, smooth ride, VaaXY-1 Ride Type',
        price: this.distance,
        icon: 'path_to_uberx_icon',
      },
      {
        name: 'VaaXY Relax',
        time: '5 mins',
        arrivalTime: '11:21 PM',
        description: 'Comfortable, smooth and cost more than Value ride, VaaXY-1, VaaXY-2 Ride',
        price: this.vaaxyRelaxz,
        icon: 'path_to_premier_icon',
      },
      {
        name: 'VaaXY Elite',
        time: '2 mins',
        arrivalTime: '11:18 PM',
        description: 'Top level ride, cost more than Value & Relax, VaaXY-3',
        price: this.vaazyElite,
        icon: 'path_to_moto_icon',
      },
      {
        name: 'VaaXY Pets',
        time: '2 mins',
        arrivalTime: '11:18 PM',
        description: 'Cost Extra, VaaXY-1, VaaXY-2, VaaXY-3',
        price: this.vaazyPets,
        icon: 'path_to_moto_icon',
      },
    ];
  }

  selectedRide: any;

  selectRide(ride: any) {
    const extraMinutes = this.calculateExtraMinutes(this.totalDistance, this.totalMinutes);
    this.selectedRide = ride;
    console.log("ride", ride)
    this.offerPrice = ride.price
    const driverRate = this.totalDistance * .80 + extraMinutes* .10;
    if (ride.name == 'VaaXY Value') {
      this.vaaxyDriverRate = driverRate
    } else if (ride.name == "VaaXY Relax") {
      this.vaaxyDriverRate = driverRate * 1.10
    } else if (ride.name == "VaaXY Elite") {
      this.vaaxyDriverRate = driverRate * 1.30
    } else if (ride.name == "VaaXY Pets") {
      this.vaaxyDriverRate = driverRate * 1.35
    }

  }

  // requestRide() {
  //   if (this.selectedRide) {
  //     console.log('Requesting ride:', this.selectedRide);
  //   } else {
  //     console.log('Please select a ride');
  //   }
  // }

  // toggleScheduler(){
  //   this.showSheduler=true;
  // }

  openOfferFareDialog() {
    const dialogRef = this.dialog.open(OfferFairComponent, {
      width: '300px',
      data: { price: this.offerPrice }  // Pass any data you want here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.discountPrice = result;
        // console.log('Offer submitted:', result);
      }
    });
  }

  selectedDateTime: string = '';

  // onDateTimeChange(event: any): void {
  //   this.cdr.detectChanges();
  //   this.selectedDateTime = event.detail.value; 


  //   console.log('Selected Date-Time:', this.selectedDateTime);
  // }

  onDateTimeChange(event: any): void {
    const selectedDateTime = event.detail.value; // Get the selected date-time value
    this.shedulerForm.patchValue({ pickupDateTime: selectedDateTime }); // Update the reactive form control
    // this.showSheduler = false; // Hide the ion-datetime picker
    console.log('Selected Date-Time:', selectedDateTime);
  }

  pickupForm() {
    this.shedulerForm = this.fb.group({
      pickupDateTime: [,[]],
      // pickupDateTime: [new Date().toISOString(), []], // Form control for the input field
    });
  }

  get formVal() {
    return this.shedulerForm.value
  }


}