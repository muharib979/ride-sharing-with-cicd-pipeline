import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { SignUpRiderComponent } from './components/sign-up-rider/sign-up-rider.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RiderComponent } from './components/rider/rider.component';
import { DriverComponent } from './components/driver/driver.component';
import { BusinessComponent } from './components/business/business.component';
import { SignUpDriverComponent } from './components/sign-up-driver/sign-up-driver.component';
import { SignUpBusinessComponent } from './components/sign-up-business/sign-up-business.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PaymentSettingsComponent } from './components/payment-settings/payment-settings.component';
import { NotificationComponent } from './features/user/notification/notification.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { RiderLaterComponent } from './components/rider-later/rider-later.component';



const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '',component:MainLayoutComponent,
    children:[
      {path:'',component:DashboardComponent},
      {path: 'sign-up', component: SignUpRiderComponent },
      {path: 'login', component: LoginComponent },
      {path: 'about-us', component: AboutUsComponent },
      {path: 'ride', component: RiderComponent },
      {path: 'rider-later', component: RiderLaterComponent },
      {path: 'driver', component: DriverComponent },
      // {path: 'driver', component: NotificationComponent },
      {path: 'signUp-driver', component: SignUpDriverComponent },
      {path: 'business', component: BusinessComponent },
      {path: 'signUp-business', component: SignUpBusinessComponent },
      {path: 'forgot-password', component: ForgotPasswordComponent },
      {path: 'payments-settings', component: PaymentSettingsComponent },
    ]
  },
  // component:UserLayoutComponent, 
  // { path: '',component:MainLayoutComponent, loadChildren: () => import('./home/home-routing.module').then(m => m.HomeRoutingModule) },
  { path: 'user',loadChildren: () => import('./features/user/user-routing.module').then(m => m.UserRoutingModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
