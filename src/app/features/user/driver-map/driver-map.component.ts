import { Component, Inject, OnInit } from '@angular/core';
import { MapDirectionsService } from '@angular/google-maps';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, interval, map } from 'rxjs';

@Component({
  selector: 'app-driver-map',
  templateUrl: './driver-map.component.html',
  styleUrl: './driver-map.component.scss'
})
export class DriverMapComponent  implements OnInit {

  // markerPositions: google.maps.LatLng[] = [];
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 5;
  fromAddress!:string
  trafficLayer!: google.maps.TrafficLayer;
  directionsResult$ = new BehaviorSubject<
    google.maps.DirectionsResult | undefined
  >(undefined);

  
  fromLocation: string = 'Rampura,Dhaka';
  toLocation: string='Gazipur,Bangladesh';


  arrowMarkerPosition?: google.maps.LatLngLiteral;
  pathCoordinates: google.maps.LatLngLiteral[] = [];
  currentIndex = 0;
  arrowRotation: number = 90;

  desIcon = {
    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      // scaledSize: { width: 30, height: 30 }
  }

  arrowIcon = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 5,
    fillColor: '#ffffff',
    fillOpacity: 1,
    strokeWeight: 1,
    rotation: 0 
  };


  // arrowIcon = {
  //   url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
  //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  //       <!-- Circle -->
  //       <circle cx="50" cy="50" r="45" fill="rgba(255, 255, 255, 0.8)" stroke="#000000" stroke-width="5" />
  //       <!-- Arrow -->
  //       <polygon points="50,15 40,65 50,55 60,65" fill="#000000" />
  //     </svg>
  //   `),
  //   anchor: new google.maps.Point(50, 50), // Center the icon
  //   scaledSize: new google.maps.Size(50, 50), 
  //   rotation: 0 
  // };

  directionsOptions = {
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#FF0000'
    }
  };
  constructor(private directionService: MapDirectionsService,private route: ActivatedRoute){
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fromAddress = params['fromAddress']
    });
    this.driverLocation();
    interval(2000).subscribe(() => {
      this.updateDriverPosition();
    });
  
  }
  lat!:number;
  lng!:number
  // directionsOptions: google.maps.DirectionsRendererOptions = {
  //   suppressMarkers: true, 
  // };
  driverLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log('User location:', lat, lng);
          this.getPlace(lat, lng);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            console.error('User denied location access');
            alert('Location access is required. Please enable location services.');
          }
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }



  getPlace(lat: number, lng: number) {


const latLng = new google.maps.LatLng(lat, lng);
console.log('Location:', lat,lng);
console.log("toLo", this.fromAddress)


    if (this.fromAddress) {
      // Use Google Maps Geocoder to get lat/lng
      const geocoder = new google.maps.Geocoder();

      // Geocode fromLocation
      // geocoder.geocode({ address: this.fromLocation }, (fromResults:any, fromStatus) => {
      //   if (fromStatus === google.maps.GeocoderStatus.OK && fromResults[0]) {
      //     const fromLatLng = fromResults[0].geometry.location;
      //     console.log("dfddf",fromLatLng)

          // Geocode toLocation
          geocoder.geocode({ address: this.fromAddress }, (toResults:any, toStatus) => {
            if (toStatus === google.maps.GeocoderStatus.OK && toResults[0]) {
              const toLatLng = toResults[0].geometry.location;

              // Use the lat/lng to display directions or markers
              // console.log('From Location:', fromLatLng.lat(), fromLatLng.lng());
              console.log('Location:', latLng, toLatLng);

              this.directions(latLng, toLatLng); // Call your directions logic

            } else {
              console.error('To location geocode was not successful:', toStatus);
            }
          });
        } else {
          console.error('From location geocode was not successful:');
        }
      // });
    // }
    //  else {
    //   console.error('Locations are not defined.');
    // }
  }
  currentPosition: google.maps.LatLngLiteral | null = null;
  directionsResult: google.maps.DirectionsResult | null = null;
  destination!:  google.maps.LatLngLiteral;

  directions(fromLatLng: google.maps.LatLng, toLatLng: google.maps.LatLng){
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading } = position.coords;

        // Update position
        this.currentPosition = {
          lat: latitude,
          lng: longitude
        };
        this.destination = {
          lat: toLatLng.lat(),
          lng: toLatLng.lng()
        };

        const bearing = this.calculateBearing(
          this.currentPosition.lat,
          this.currentPosition.lng,
          fromLatLng.lat(),
          fromLatLng.lng()
        );

        // Update arrow rotation
        this.arrowIcon = {
          ...this.arrowIcon,
          rotation: bearing
        };
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );

    // Fetch directions (Example: origin & destination hardcoded)
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: fromLatLng,
        destination: toLatLng,// Replace with your destination
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          this.directionsResult = result;
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  }
  
  


  getDirections(fromLatLng: google.maps.LatLng, toLatLng: google.maps.LatLng) {
    const directionsService = new google.maps.DirectionsService();
    const request: google.maps.DirectionsRequest = {
      origin: fromLatLng,
      destination: toLatLng,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionService
    .route(request)
    .pipe(map((response:any) => response.result))
    .subscribe((res:any) => {
      this.directionsResult$.next(res);
      this.markerPositions = [];

      
      // this.arrowMarkerPosition = { lat:fromLatLng.lat(), lng: fromLatLng.lng()};

  });

  
 
}
driverPosition: google.maps.LatLngLiteral = { lat: this.lat, lng: this.lng }; // Initial position


updateDriverPosition() {
  if (this.markerPositions.length >= 2) {
    const [start, next] = this.markerPositions;

    // Calculate bearing between two points
    // this.arrowRotation = this.calculateBearing(start, next);

    // Update driver's position to simulate movement
    this.driverPosition = next;

    // Shift marker positions for next calculation
    this.markerPositions = this.markerPositions.slice(1);
  }
}

// Function to calculate bearing
calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);

  const bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360; // Normalize to 0-360 degrees
}




}
