import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  constructor(private http: HttpClient, private router: Router) { }

  userSetup(user: any) {
    return this.http.post(environment.apiUrl + 'user-setup', user);
  }
  userPreferenceSave(preference: any) {
    return this.http.post(environment.apiUrl + 'user-preference', preference);
  }

  creditCardSetup(credit: any) {
    return this.http.post(environment.apiUrl + 'credit-card-setup', credit);
  }
  getUserSetup(userId: string) {
    return this.http.get(`${environment.apiUrl}get-user-setup/` + userId);
  }
  getPreference(userId: string) {
    return this.http.get(`${environment.apiUrl}get-preference/` + userId);
  }
  getProfile(userId: string) {
    return this.http.get(`${environment.apiUrl}get-details-ride/` + userId);
  }
  getProfileBusiness(userId: string) {
    return this.http.get(`${environment.apiUrl}get-details-business/` + userId);
  }
  getProfileDriver(userId: string) {
    return this.http.get(`${environment.apiUrl}GetDetailsDriver/` + userId);
  }
  getCreditCardInfo(userId: string) {
    return this.http.get(`${environment.apiUrl}get-credit-card-by-userId/` + userId);
  }
  updateRider(user: any) {
    return this.http.post(environment.apiUrl + 'update-rider', user);
  }
  updateDriver(user: any) {
    return this.http.post(environment.apiUrl + 'update-driver', user);
  }
  updateBusiness(user: any) {
    return this.http.post(environment.apiUrl + 'update-business', user);
  }

  goOnline(onlineStatus: any) {
    return this.http.post(environment.apiUrl + 'go-online', onlineStatus);
  }
}
