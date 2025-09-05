import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  constructor() {}

  // Method to calculate the distance using the Distance Matrix Service
  getDistance(origin: string, destination: string): Promise<any> {
    const service = new google.maps.DistanceMatrixService();

    const request = {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL, // to get the result in miles
    };

    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(request, (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          resolve(response);
        } else {
          reject('Error with the Distance Matrix Service: ' + status);
        }
      });
    });
  }
}