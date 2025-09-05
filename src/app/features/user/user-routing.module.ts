import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { InboxComponent } from './inbox/inbox.component';
import { UserLayoutComponent } from '../../layout/user-layout/user-layout.component';
import { ProfileComponent } from './profile/profile.component';
import { PreferenceComponent } from './preference/preference.component';
import { PaymentSettingComponent } from './payment-setting/payment-setting.component';
import { SecurityAndPasswordComponent } from './security-and-password/security-and-password.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyStatementComponent } from './privacy-statement/privacy-statement.component';
import { HelpAndSupportComponent } from './help-and-support/help-and-support.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ProfileDriverComponent } from './profile-driver/profile-driver.component';
import { UserDucumentsComponent } from './user-ducuments/user-ducuments.component';
import { ProfileBusinessComponent } from './profile-business/profile-business.component';
import { NotificationComponent } from './notification/notification.component';
import { RiderComponent } from '../../components/rider/rider.component';
import { DriverMapComponent } from './driver-map/driver-map.component';


const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '',component:UserLayoutComponent,
    children:[
      {path:'',component:UserDashboardComponent},
      // {path: 'inbox', component: InboxComponent },
      {path: 'inbox', component: NotificationComponent },
      {path: 'profile', component: ProfileComponent },
      {path: 'profile-driver', component: ProfileDriverComponent },
      {path: 'profile-business', component: ProfileBusinessComponent },
      {path: 'preferences', component: PreferenceComponent },
      {path: 'payment-setting', component:PaymentSettingComponent },
      {path: 'security', component:SecurityAndPasswordComponent },
      {path: 'terms-and-conditions', component:TermsAndConditionsComponent },
      {path: 'privacy-statement', component:PrivacyStatementComponent },
      {path: 'help-and-support', component:HelpAndSupportComponent },
      {path: 'user-documentation', component:UserDucumentsComponent },
      {path: 'rider', component:RiderComponent },
      {path: 'map', component:DriverMapComponent },
    ]
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
    // {path: '', component: UserDashboardComponent },
    // {path: 'inbox', component: InboxComponent },

  exports: [RouterModule],
  providers: [provideNativeDateAdapter()],

})
export class UserRoutingModule { }
