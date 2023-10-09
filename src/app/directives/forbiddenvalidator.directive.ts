import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appForbiddenValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true }]
})
export class ForbiddenValidatorDirective implements Validator {

  @Input('appForbiddenNames') forbiddenNames: string[] = [];

  validate(control: AbstractControl): ValidationErrors | null {
    return this.forbiddenNames.includes(control.value) ? { 'forbiddenName': { value: control.value } } : null;
  }

}

export function NameSurnameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const nameSurnamePattern = /^ [a-zA-Z]+ [a-zA-Z]+$/;
    const nameSurnameValid = nameSurnamePattern.test(control.value);
    return !nameSurnameValid ? { 'nameSurnameInvalid': { value: control.value } } : null;
  };
}
