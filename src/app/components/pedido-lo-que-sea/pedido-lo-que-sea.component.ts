import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-pedido-lo-que-sea',
  templateUrl: './pedido-lo-que-sea.component.html',
  styleUrls: ['./pedido-lo-que-sea.component.css']
})
export class PedidoLoQueSeaComponent implements OnInit {
  titulo: string = 'Realizar un pedido de lo que sea';

  esDepto: boolean = false;
  subioImagen: boolean = false;

  imagen: any;

  // @ts-ignore
  formPedido: FormGroup;

  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.buildForm();
  }

  ngOnInit() {
  }

  private buildForm(): void {
    this.formPedido = this.formBuilder.group({
      descripcionPedido: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      imagen: [null,[]],
      calleNombreComercio: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      calleNumeroComercio: [null, [Validators.required, Validators.pattern("[0-9]{1,5}")]],
      ciudadComercio: [null, [Validators.required]],
      referenciaComercio: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      calleNombreDomicilio: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      calleNumeroDomicilio: [null, [Validators.required, Validators.pattern("[0-9]{1,5}")]],
      pisoDomicilio: [null, Validators.pattern("[0-9]{1,2}")],
      deptoDomicilio: [null, Validators.pattern("[A-Z]{1}")],
      ciudadDomicilio: [null ,Validators.required],
      referenciaDomicilio: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      momentoEntrega: [null, Validators.required],
      fechaEntrega: [null],
      horaEntrega: [null],
      formaPago: [null, Validators.required],
      montoAAbonar: [null, [Validators.min(50), Validators.max(999999)]],
      nroTarjeta: [null, Validators.pattern("5[0-5]{1}[0-9]{14}")],
      titularTarjeta: [null, [Validators.minLength(4), Validators.maxLength(50)]],
      fechaVencimientoTarjeta: [null, [Validators.pattern('(1[012][-/]2022)|((0[1-9]|1[012])[-/]20(2[3-9]{1}|[3-9]{2}))')]],
      codigoSeguridadTarjeta: [ null, [Validators.pattern('[0-9]{3}')]]
    });
  }

  agregar() {
    this.formPedido.reset({ ciudadDomicilio: 'Córdoba' });

    // Reseteamos bandera y estado del formulario.
    this.submitted = false;
    this.formPedido.markAsUntouched();
  }

  grabar() {
    this.submitted = true;
    if (this.formPedido.invalid) return;

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.formPedido.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    let arrFecha = itemCopy.FechaAlta.substr(0, 10).split("/");
    if (arrFecha.length == 3)
      itemCopy.FechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();
  }

  // Traer la imagen
  validarArchivo(evento: any): void {
    const extensionesPermitidas = ['jpg', 'JPG'];
    const limiteTamano = 5_000_000;

    const archivo = evento.target.files[0];

    const tamanoImagen = archivo.size;
    const nombreArchivo = archivo.name;
    const extensionArchivo = nombreArchivo.split(".").pop();

    if(!extensionesPermitidas.includes(extensionArchivo)) {
      alert("El tipo de imagen no es el permitido. Por favor, suba una imagen con extensión .jpg o .JPG");
      return;
    } else if (tamanoImagen > limiteTamano) {
      alert("El tamaño de la imagen es demasiado grande. Por favor, suba un archivo menor a 5MB.");
      return;
    } else {
      this.subioImagen = true;
      this.convertToBase64(archivo);
    }
  }

  // Convierte un archivo binario en un texto en base 64.
  convertToBase64(archivo: File) {
    const observable = new Observable((subscriber : any) => {
      this.readFile(archivo,subscriber);
    });
    observable.subscribe((imagen) => {
      this.imagen = imagen;
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
