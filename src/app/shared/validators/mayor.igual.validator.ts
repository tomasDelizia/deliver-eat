import {AbstractControl, ValidatorFn} from "@angular/forms";

export class MayorIgualValidator {
  static mayorIgual(min: number): ValidatorFn {
    return (c: AbstractControl) => {

      if (c == null || c.value == null)
        return null;

      // @ts-ignore
      let isValid = c.value >= min();
      if (isValid) {
        return null;
      } else {
        return {
          validateMinDate: {
            valid: false
          }
        };
      }
    };
  }
}
