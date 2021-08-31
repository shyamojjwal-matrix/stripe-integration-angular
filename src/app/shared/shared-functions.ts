import { FormGroup, FormControl } from '@angular/forms';

export function checkFormValidation(form: FormGroup, listValidationMessage: any) {
    let showValidationMessages: any = {};

    for(const _key of Object.keys(form.controls)){
        let cur_control = form.get(_key);
        if(cur_control instanceof FormControl) {
            showValidationMessages[_key] = '';
            if (cur_control.invalid && (cur_control.dirty || cur_control.touched)) {
              let errors = cur_control.errors;
              for(const _err of Object.keys(errors)) {
                showValidationMessages[_key] = listValidationMessage[_key][_err];
              }
            }
        }
    }
    return showValidationMessages;
}

export function makeAllFormControlAsDirty(form: FormGroup) {
    Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
    });
}

export function loadDynamicScript(url: string, value: any): HTMLScriptElement | null {
    var scripts = document.getElementById(url);
    if (!scripts) {
        // console.log(url, ' Script is not availble');
        value.src = url;
        value.type = 'text/javascript';
        value.defer = true;
        value.id = url;
        return value;
    }
    else {
        // console.log(url, ' Script is availble');
        return null;
    }
}