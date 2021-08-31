import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StripPaymentRoutingModule } from './strip-payment-routing.module';
import { StripPaymentComponent } from './strip-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StripPaymentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StripPaymentRoutingModule
  ]
})
export class StripPaymentModule { }
