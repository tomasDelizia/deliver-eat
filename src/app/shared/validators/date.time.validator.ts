import { FormControl } from '@angular/forms';

export class DateTimeValidator {

  static moreThanToday(control: FormControl): { [p: string]: any } | null {
    let date: string = control.value;
    let today: string = new Date().toISOString().slice(0, 10);

    if (date < today)
      return { "moreThanToday": true };

    return null;
  }
}
