import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StripPaymentComponent } from './strip-payment.component';

const routes: Routes = [
  {
    path: "",
    component: StripPaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StripPaymentRoutingModule { }
