import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileReadingService {

  constructor() {}

  // Convierte un archivo binario en un texto en base 64.
  convertToBase64(archivo: File): any {
    const observable = new Observable((subscriber : any) => {
      this.readFile(archivo, subscriber);
    });
    observable.subscribe((archivo) => {
      return archivo;
    });
  }

  readFile(archivo: File, subscriber: any) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(archivo);

    fileReader.onload = () => {
      subscriber.next(fileReader.result);
      subscriber.complete();
    };
    fileReader.onerror = (error) => {
      subscriber.error(error)
    }
  }
}
