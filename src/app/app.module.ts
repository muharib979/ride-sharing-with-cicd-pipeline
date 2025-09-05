import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { NgOtpInputModule } from 'ng-otp-input';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignUpRiderComponent } from './components/sign-up-rider/sign-up-rider.component';
import { SignUpDriverComponent } from './components/sign-up-driver/sign-up-driver.component';
import { SignUpBusinessComponent } from './components/sign-up-business/sign-up-business.component';
import { ImagePreviewDialogComponent } from './components/image-preview-dialog/image-preview-dialog.component';
import { UserHeaderComponent } from './layout/user-header/user-header.component';
import { UserModule } from './features/user/user.module';
import { RiderComponent } from './components/rider/rider.component';
import { DriverComponent } from './components/driver/driver.component';
import { BusinessComponent } from './components/business/business.component';
import { LoginComponent } from './components/login/login.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { SharedModule } from './shared/shared.module';
import {MatRadioModule} from '@angular/material/radio';
import { ToastrModule } from 'ngx-toastr';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PaymentSettingsComponent } from './components/payment-settings/payment-settings.component';
import { DatePipe } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { PlaceAndTimeComponent } from './components/place-and-time/place-and-time.component';
import { MapDetailsComponent } from './components/map-details/map-details.component';
import { MapDisplayComponent } from './components/map-display/map-display.component';
import { RideDetailsWithPriceComponent } from './components/ride-details-with-price/ride-details-with-price.component';
import { RiderNotificationComponent } from './features/rider-notification/rider-notification.component';
import { OfferFairComponent } from './features/offer-fair/offer-fair.component';
import { NgToastModule } from 'ng-angular-popup';
import { RiderLaterComponent } from './components/rider-later/rider-later.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainLayoutComponent,
    UserLayoutComponent,
    DashboardComponent,
    SignUpRiderComponent,
    SignUpDriverComponent,
    // SignUpBusinessComponent,
    ImagePreviewDialogComponent,
    UserHeaderComponent,
    RiderComponent,
    DriverComponent,
    BusinessComponent,
    LoginComponent,
    AboutUsComponent,
    ForgotPasswordComponent,
    PaymentSettingsComponent,
    PlaceAndTimeComponent,
    MapDetailsComponent,
    MapDisplayComponent,
    RideDetailsWithPriceComponent,
    RiderNotificationComponent,
    OfferFairComponent,
    RiderLaterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule, MatChipsModule, MatProgressBarModule, MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTabsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    IonicModule.forRoot({ mode: 'ios' }),
    NgOtpInputModule,
    FlexLayoutModule,
    NgbModule,
    ToastrModule.forRoot(),
    UserModule,
    SharedModule,
    GoogleMapsModule,
    NgToastModule
  ],
  //   exports:[
  //   SignUpBusinessComponent
  // ],

  providers: [
    provideHttpClient(withInterceptorsFromDi()), 
    provideNativeDateAdapter(),
    DatePipe
  ],
  bootstrap: [AppComponent],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
