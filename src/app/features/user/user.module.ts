import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { InboxComponent } from './inbox/inbox.component';
import { ProfileComponent } from './profile/profile.component';
import { PreferenceComponent } from './preference/preference.component';
import { PaymentSettingComponent } from './payment-setting/payment-setting.component';
import { SecurityAndPasswordComponent } from './security-and-password/security-and-password.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyStatementComponent } from './privacy-statement/privacy-statement.component';
import { HelpAndSupportComponent } from './help-and-support/help-and-support.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputModule } from 'ng-otp-input';
import { SignUpBusinessComponent } from '../../components/sign-up-business/sign-up-business.component';
import { MatSelectModule } from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileDriverComponent } from './profile-driver/profile-driver.component';
import { UserDucumentsComponent } from './user-ducuments/user-ducuments.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { ProfileBusinessComponent } from './profile-business/profile-business.component';
import { NotificationComponent } from './notification/notification.component';
import { DriverMapComponent } from './driver-map/driver-map.component';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [
    UserDashboardComponent,
    InboxComponent,
    ProfileComponent,
    PreferenceComponent,
    PaymentSettingComponent,
    SecurityAndPasswordComponent,
    TermsAndConditionsComponent,
    PrivacyStatementComponent,
    HelpAndSupportComponent,
    SignUpBusinessComponent,
    ChangePasswordComponent,
    ProfileDriverComponent,
    UserDucumentsComponent,
    ProfileBusinessComponent,
    NotificationComponent,
    DriverMapComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
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
    MatDialogModule,
    MatSlideToggleModule,
    IonicModule.forRoot({ mode: 'ios' }),
    NgOtpInputModule,
    FlexLayoutModule,
    NgbModule,
    SharedModule,
    GoogleMapsModule
  ],
  exports:[
    SignUpBusinessComponent,
    
  ]
})
export class UserModule { }
