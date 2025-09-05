import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';

export interface PlaceSearchResult {
  address: string;
  location?: google.maps.LatLng;
  imageUrl?: string;
  iconUrl?: string;
  name?: string;
}

@Component({
  selector: 'app-place-and-time',
  templateUrl: './place-and-time.component.html',
  styleUrl: './place-and-time.component.scss'
})
export class PlaceAndTimeComponent implements OnInit {
  @ViewChild('inputField')
  inputField!: ElementRef;
  isLocationShow: boolean = false;
  placeName!:any;

  @Input() placeholder = 'Enter address...';

  @Output() placeChanged = new EventEmitter<PlaceSearchResult>();

  autocomplete: google.maps.places.Autocomplete | undefined;

  listener: any;

  constructor(private ngZone: NgZone,private http: HttpClient) { }

  ngOnInit() {
    if (this.placeholder == 'Enter from address...') {
      this.isLocationShow = true;
    }

  }

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.inputField.nativeElement
    );
    const inputElement = this.inputField.nativeElement;
    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.autocomplete?.getPlace();
        const result: PlaceSearchResult = {
          address: this.inputField.nativeElement.value,
          name: place?.name,
          location: place?.geometry?.location,
          imageUrl: this.getPhotoUrl(place),
          iconUrl: place?.icon,
        };

        this.placeChanged.emit(result);
      });
     
    });
  }

  getPhotoUrl(
    place: google.maps.places.PlaceResult | undefined
  ): string | undefined {
    return place?.photos && place?.photos.length > 0
      ? place?.photos[0].getUrl({ maxWidth: 500 })
      : undefined;
  }

  ngOnDestroy() {
    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
    }
  }

  onCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Now get the place name from latitude and longitude
          this.getPlaceName(lat, lng);
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



  getPlaceName(lat: number, lng: number): void {
    const apiKey = 'AIzaSyCef4A4prSy0xx2JGG2YEe1PEjxgJvRgEo&libraries=places';  // Replace with your actual API key
    // const geocodeUrl = https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey};
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&region=USA&language=en&key=${apiKey}`;

    this.http.get(geocodeUrl).subscribe((response: any) => {
      if (response && response.results && response.results.length > 0) {
        this.placeName = response.results[0].formatted_address;
        this.inputField.nativeElement.value = this.placeName;
        
        const result: PlaceSearchResult = {
          address: this.placeName,
          location: new google.maps.LatLng(lat, lng)
          // location: new google.maps.LatLng(lat, lng)
        };
        this.placeChanged.emit(result);
      } else {
        console.error('No results found for the given coordinates');
        alert('Unable to retrieve place name. Please try again.');
      }
    }, (error) => {
      console.error('Error in geocoding request:', error);
      alert('Unable to retrieve place name. Please try again.');
    });
  }

onPlaceNameClick() {
  // Set the value of the input field to the placeName when clicked
  if (this.placeName) {
    this.inputField.nativeElement.value = this.placeName;
  }
}
}
