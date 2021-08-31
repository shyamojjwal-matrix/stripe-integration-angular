import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../services/global.service';
import { environment } from "src/environments/environment";

import { checkFormValidation, loadDynamicScript, makeAllFormControlAsDirty } from 'src/app/shared/shared-functions';
import { paymentValidationMessage } from 'src/app/shared/validation-messages';

declare var Stripe: any;

@Component({
  selector: 'app-strip-payment',
  templateUrl: './strip-payment.component.html',
  styleUrls: ['./strip-payment.component.scss']
})
export class StripPaymentComponent implements OnInit, AfterViewInit {

  public stripePaymentForm: FormGroup | any;

  public isPaymentProcessing: boolean = false;

  private STRIPE_PUBLISHABLE_KEY: string = environment.STRIPE_PUBLISHABLE_KEY;

  public stripe: any;
  public elements: any;

  public cardNumber:any;

  public cardExpiry:any;

  public cardCvc:any;

  public paymentValidationMessage: any = {};

  constructor(
    private renderer: Renderer2,
    private FB: FormBuilder,
    private globals: GlobalService
  ) { }

  ngOnInit(): void {
    this.initStripPaymentForm();
  }

  ngAfterViewInit() {
    let loadingStripeScript = this.renderer.createElement('script');
    loadingStripeScript = loadDynamicScript('https://js.stripe.com/v3/', loadingStripeScript);
    loadingStripeScript == null ? '' : this.renderer.appendChild(document.body, loadingStripeScript);
    loadingStripeScript != null ? loadingStripeScript.onload = () => {
      this.globals.stripe = Stripe(this.STRIPE_PUBLISHABLE_KEY); // use your test publishable key
      this.globals.elements = this.globals.stripe.elements();
      this.stripe = this.globals.stripe;
      this.elements = this.globals.elements;
    } : ''

    if(loadingStripeScript == null) {
      this.stripe = this.globals.stripe;
      this.elements = this.globals.elements;
    };

    setTimeout(() => {
      this.initiateStripe();
    }, 300);
  }

  initiateStripe = () => {
    this.elements = this.stripe.elements({
      fonts: [
        {
          cssSrc: 'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700&display=swap',
        },
      ],
    });
    var elementStyles = {
      base: {
          color: '#000000',
          lineHeight: '20px',
          fontFamily: '"Poppins", sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '13px', 
          fontStyle: 'italic',

        ':focus': {
          color: '#000000',
        },

        '::placeholder': {
          color: '#a3a3a3',
        },

        ':focus::placeholder': {
          color: '#a3a3a3',
        },
      },
      invalid: {
        color: '#ff0000',
        ':focus': {
          color: '#ff0000',
        },
        '::placeholder': {
          color: '#ff0000',
        },
      },
    };

    var elementClasses = {
      focus: 'focus',
      empty: 'empty',
      invalid: 'invalid',
      base: 'form-control form-field'
    };

    this.cardNumber = this.elements.create('cardNumber', {
      style: elementStyles,
      classes: elementClasses,
      placeholder: 'Card Number',
      showIcon: true,
    });
    this.cardNumber.mount('#pay-card-number');

    this.cardNumber.on('change', (event: any) => {
      let _fieldControl = this.stripePaymentForm.get('cardnumber');
      _fieldControl.markAsDirty();

      _fieldControl.setValue('cardNumber');
      if(event.error != undefined && Object.keys(event.error).length > 0) {
        if(event.error.code == 'incomplete_number') {
          if(_fieldControl.errors && Object.keys(_fieldControl.errors).includes('invalid_number')) {
            delete _fieldControl.errors.invalid_number;
          }
          _fieldControl.setErrors({incomplete_number: true});
        } else if (event.error.code == 'invalid_number') {

          if(_fieldControl.errors && Object.keys(_fieldControl.errors).includes('incomplete_number')) {
            delete _fieldControl.errors.incomplete_number;
          }

          _fieldControl.setErrors({invalid_number: true});
        } else {
          _fieldControl.setErrors(null)
        }
      }
      this.validateStripPaymentForm();
    })

    this.cardExpiry = this.elements.create('cardExpiry', {
      style: elementStyles,
      classes: elementClasses,
    });
    this.cardExpiry.mount('#pay-card-expiry');

    this.cardExpiry.on('change', (event: any) => {
      let _fieldControl = this.stripePaymentForm.get('exp_date');
      _fieldControl.markAsDirty();

      _fieldControl.setValue('exp_date');
      if(event.error != undefined && Object.keys(event.error).length > 0) {
        if(event.error.code == 'incomplete_expiry') {
          if(_fieldControl.errors && Object.keys(_fieldControl.errors).includes('invalid_expiry_month_past')) {
            delete _fieldControl.errors.invalid_expiry_month_past;
          }
          if(_fieldControl.errors && Object.keys(_fieldControl.errors).includes('invalid_expiry_year_past')) {
            delete _fieldControl.errors.invalid_expiry_year_past;
          }
          _fieldControl.setErrors({incomplete_expiry: true});

        } else if (event.error.code == 'invalid_expiry_month_past') {

          if(_fieldControl.errors && Object.keys(_fieldControl.errors).includes('incomplete_expiry')) {
            delete _fieldControl.errors.incomplete_expiry;
          }

          if(_fieldControl.errors && Object.keys(_fieldControl.errors).includes('invalid_expiry_year_past')) {
            delete _fieldControl.errors.invalid_expiry_year_past;
          }

          _fieldControl.setErrors({invalid_expiry_month_past: true});

        } else if (event.error.code == 'invalid_expiry_year_past') {

          if(_fieldControl.errors && Object.keys(_fieldControl.errors).includes('incomplete_expiry')) {
            delete _fieldControl.errors.incomplete_expiry;
          }

          if(_fieldControl.errors && Object.keys(_fieldControl.errors).includes('invalid_expiry_month_past')) {
            delete _fieldControl.errors.invalid_expiry_month_past;
          }

          _fieldControl.setErrors({invalid_expiry_year_past: true});
        } else {
          _fieldControl.setErrors(null)
        }
      }
      this.validateStripPaymentForm();
    })

    this.cardCvc = this.elements.create('cardCvc', {
      style: elementStyles,
      classes: elementClasses,
      placeholder: 'CVV',
    });

    this.cardCvc.mount('#pay-card-cvc');
    this.cardCvc.on('change', (event: any) => {
      let _fieldControl = this.stripePaymentForm.get('cvc');
      _fieldControl.markAsDirty();

      _fieldControl.setValue('cvc');
      if(event.error != undefined && Object.keys(event.error).length > 0) {
        if(event.error.code == 'incomplete_cvc') {
          _fieldControl.setErrors({incomplete_cvc: true});
        } else {
          _fieldControl.setErrors(null)
        }
      }
      this.validateStripPaymentForm();
    })
  }

  initStripPaymentForm = () => {
    this.stripePaymentForm = this.FB.group({
      cardholdername: ['', [Validators.required]],
      cardnumber: ['', [Validators.required]],
      exp_date: ['', [Validators.required]],
      cvc: ['', [Validators.required]],
    })
    this.stripePaymentForm.get('cardholdername').valueChanges.subscribe(()=>{
      this.trimPaymentFieldValues('cardholdername');
    })
  }

  get f() { return this.stripePaymentForm.controls; }

  validateStripPaymentForm = () => {
    this.paymentValidationMessage = checkFormValidation(this.stripePaymentForm, paymentValidationMessage);
  }

  cardHolderNameFieldFocus = () => {
    this.stripePaymentForm.get('cardholdername').markAsDirty();
  }

  changeCardHolderName = (inputEvent:any) => {
    this.stripePaymentForm.get('cardholdername').setValue(inputEvent.target.value.toString().trim())
    inputEvent.target.value = inputEvent.target.value.toString().trim();
  }

  trimPaymentFieldValues = (_field:any) => {
    let _value = this.stripePaymentForm.get(_field).value.toString().trim();
    let _control = this.stripePaymentForm.get(_field);

    if(_control.valid) {
      if(_value.length == 0) {
        _control.setValue(_value);
        _control.setErrors({required: true})
      }
    }
  }

  submitPaymentForm = () => {
    if(this.stripePaymentForm.valid) {
      this.isPaymentProcessing = true;
      this.stripe.createToken(this.cardNumber).then((result:any) => {
        if(result.error) {
          if(result.error.code == 'incomplete_number') {
            this.stripePaymentForm.get('cardnumber').setErrors({incomplete_number: true});
          } else if (result.error.code == 'invalid_number') {
            this.stripePaymentForm.get('cardnumber').setErrors({invalid_number: true});
          }
          // For expiry date
          if(result.error.code == 'incomplete_expiry') {
            this.stripePaymentForm.get('cardnumber').setErrors({incomplete_expiry: true});
          } else if (result.error.code == 'invalid_expiry_month_past') {
            this.stripePaymentForm.get('cardnumber').setErrors({invalid_expiry_month_past: true});
          } else if (result.error.code == 'invalid_expiry_year_past') {
            this.stripePaymentForm.get('cardnumber').setErrors({invalid_expiry_year_past: true});
          }
          // For CVC code
          if(result.error.code == 'incomplete_cvc') {
            this.stripePaymentForm.get('cardnumber').setErrors({incomplete_cvc: true});
          }

          makeAllFormControlAsDirty(this.stripePaymentForm);
          this.validateStripPaymentForm();
          this.isPaymentProcessing = false;

        } else {
          console.log("Strip Payment Token success: ", result)
          this.isPaymentProcessing = false;
          alert(`Token: ${result?.token?.id}`)
        }
      })
    } else {
      makeAllFormControlAsDirty(this.stripePaymentForm);
      this.validateStripPaymentForm();
    }
    console.log("submitPaymentForm: ", this.stripePaymentForm)
  }

}
