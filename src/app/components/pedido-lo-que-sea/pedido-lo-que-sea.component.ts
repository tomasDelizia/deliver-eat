import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {conditionalValidator} from "../../shared/validators/conditional.validator";
import {DateTimeValidator} from "../../shared/validators/date.time.validator";

@Component({
  selector: 'app-pedido-lo-que-sea',
  templateUrl: './pedido-lo-que-sea.component.html',
  styleUrls: ['./pedido-lo-que-sea.component.css']
})
export class PedidoLoQueSeaComponent implements OnInit {
  titulo: string = 'Realizar un pedido de lo que sea';

  urlImagen: string;

  formPedido: FormGroup;

  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();

    this.form['checkboxEsDepartamento'].valueChanges
      .subscribe(() => {
        this.form['pisoDepto'].updateValueAndValidity();
        this.form['letraDepto'].updateValueAndValidity();
      });

    this.form['momentoEntrega'].valueChanges
      .subscribe(() => {
        this.form['fechaEntrega'].updateValueAndValidity();
        this.form['horaEntrega'].updateValueAndValidity();
      });

    this.form['formaPago'].valueChanges
      .subscribe(() => {
        this.form['montoAAbonar'].updateValueAndValidity();
        this.form['nroTarjeta'].updateValueAndValidity();
        this.form['titularTarjeta'].updateValueAndValidity();
        this.form['fechaVencimientoTarjeta'].updateValueAndValidity();
        this.form['codigoSeguridadTarjeta'].updateValueAndValidity();
      });
  }

  get form() {
    return this.formPedido.controls;
  }

  get momentoEntrega() {
    return this.form['momentoEntrega'].value;
  }

  get formaPago() {
    return this.form['formaPago'].value;
  }

  get checkboxEsDepartamento() {
    return this.form['checkboxEsDepartamento'].value;
  }

  private buildForm(): void {
    this.formPedido = this.formBuilder.group({
      descripcionPedido: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      imagen: [null],
      calleNombreComercio: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      calleNumeroComercio: [null, [Validators.required, Validators.pattern("[0-9]{1,5}")]],
      ciudadComercio: [null, [Validators.required]],
      referenciaComercio: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      calleNombreDomicilio: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      calleNumeroDomicilio: [null, [Validators.required, Validators.pattern("[0-9]{1,5}")]],
      checkboxEsDepartamento: [null],
      pisoDepto: [null, [
        Validators.pattern("[0-9]{1,2}"),
        conditionalValidator(() => this.checkboxEsDepartamento, Validators.required)]],
      letraDepto: [null, [
        Validators.pattern("[A-Z]{1}"),
        conditionalValidator(() => this.checkboxEsDepartamento, Validators.required)]],
      ciudadDomicilio: [null ,Validators.required],
      referenciaDomicilio: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      momentoEntrega: [null, Validators.required],
      fechaEntrega: [null, [
        DateTimeValidator.moreThanToday,
        conditionalValidator(() => this.momentoEntrega === 'programar', Validators.required)]],
      horaEntrega: [null, conditionalValidator(() => this.momentoEntrega === 'programar', Validators.required)],
      formaPago: [null, Validators.required],
      montoAAbonar: [null, [
        Validators.min(50),
        Validators.max(999999),
        conditionalValidator(() => this.formaPago === 'efectivo', Validators.required)]],
      nroTarjeta: [null, [
        Validators.pattern("5[0-5]{1}[0-9]{14}"),
        conditionalValidator(() => this.formaPago === 'tarjeta', Validators.required)]],
      titularTarjeta: [null, [
        Validators.minLength(4),
        Validators.maxLength(50),
        conditionalValidator(() => this.formaPago === 'tarjeta', Validators.required)]],
      fechaVencimientoTarjeta: [null, [
        Validators.pattern('(1[012][-/]2022)|((0[1-9]|1[012])[-/]20(2[3-9]{1}|[3-9]{2}))'),
        conditionalValidator(() => this.formaPago === 'tarjeta', Validators.required)]],
      codigoSeguridadTarjeta: [ null, [
        Validators.pattern('[0-9]{3}'),
        conditionalValidator(() => this.formaPago === 'tarjeta', Validators.required)]]
    });
  }

  onImagenChange(evento: any): void {
    this.formPedido.patchValue({ imagen: null });
    this.urlImagen = '';

    const extensionesPermitidas = ['jpg'];
    const tamanoMaximo = 5_000_000; // Tamaño máximo de 5MB.

    if (evento.target.files.length === 0) return;

    const imagenASubir = evento.target.files[0];

    const tamanoImagen = imagenASubir.size;
    const nombreImagen = imagenASubir.name;
    const extension = nombreImagen.split(".").pop();

    if(!extensionesPermitidas.includes(extension)) {
      alert("El tipo de imagen no es el permitido. Por favor, suba una imagen con extensión jpg");
    } else if (tamanoImagen > tamanoMaximo) {
      alert("El tamaño de la imagen es demasiado grande. Por favor, suba un archivo menor a 5MB.");
    } else {
      this.formPedido.patchValue({ imagen: imagenASubir });
      // Vista previa de imagen.
      const reader: FileReader = new FileReader();
      reader.onload = () => this.urlImagen = reader.result as string;
      reader.readAsDataURL(imagenASubir);
    }
  }

  esHoraValida(fecha: string, hora: string): boolean {
    let hoy: string = new Date().toISOString().slice(0, 10);
    let ahora: string = new Date().toTimeString().slice(0, 5);

    return !(hoy === fecha && hora < ahora);
  }

  agregar() {
    this.formPedido.reset();

    // Reseteamos bandera y estado del formulario.
    this.submitted = false;
    this.formPedido.markAsUntouched();
  }

  confirmarPedido() {
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
}
