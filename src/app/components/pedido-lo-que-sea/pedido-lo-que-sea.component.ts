import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { conditionalValidator } from "../../shared/validators/conditional.validator";
import { DateTimeValidator } from "../../shared/validators/date.time.validator";
import { Ciudad, ciudades } from "../../models/ciudad";
import {DireccionEntrega, direccionesEntrega} from "../../models/direccion.entrega";
import * as moment from "moment/moment";

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

  posicion: google.maps.LatLngLiteral = { lat: -31.4290879, lng: -64.18715 }

  zoom: number = 15;

  posicionMarcador: google.maps.LatLngLiteral | null;

  opcionesMarcador: google.maps.MarkerOptions = { draggable: false };

  ciudades: Ciudad[] = ciudades;

  distancia: number;

  totalAPagar: number;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();

    this.form['ciudadComercio'].valueChanges
      .subscribe((valor) => {
        let ciudad: Ciudad = this.ciudades.find(c => c.id === valor) as Ciudad;
        this.posicion = ciudad.posicion;
      })

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
    this.form['totalAPagar'].valueChanges
      .subscribe(() => {

      })
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

  get ciudadComercio() {
    return this.form['ciudadComercio'].value;
  }

  get ciudadDomicilio() {
    return this.form['ciudadDomicilio'].value;
  }

  private buildForm(): void {
    this.formPedido = this.formBuilder.group({
      descripcionPedido: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      imagen: [null],
      calleNombreComercio: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      calleNumeroComercio: [null, [Validators.required, Validators.pattern("[0-9]{1,5}")]],
      ciudadComercio: [1, [Validators.required]],
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
      totalAPagar: null,
      montoAAbonar: [null, [
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
    let hoy: string = moment().format('YYYY-MM-DD');
    let ahora: string = moment().format('HH:mm');

    if (hoy === fecha && hora < ahora) {
      this.form['horaEntrega'].setErrors( { "horaInvalida": true });
      return false;
    }
    return true;
  }

  confirmarPedido() {
    this.submitted = true;
    if (this.formPedido.invalid) return;
    alert('Pedido realizado con éxito xd');

    // Reseteamos bandera y estado del formulario.
    this.submitted = false;
    this.formPedido.reset({ ciudadComercio: 1 });
    this.formPedido.markAsUntouched();
    this.posicionMarcador = null;
    this.urlImagen = '';
  }

  agregarMarcador(evento: google.maps.MapMouseEvent) {
    if (evento.latLng != null) this.posicionMarcador = evento.latLng.toJSON();

    let indice: number = Math.floor(Math.random() * 5);
    let direccionRnd: DireccionEntrega = direccionesEntrega.filter(d => d.ciudad.id === this.ciudadComercio)[indice];

    this.formPedido.patchValue(
      {
        calleNombreComercio: direccionRnd.calleNombre,
        calleNumeroComercio: direccionRnd.calleNumero
      });
  }

  completoDirecciones(): boolean {
    return this.form['calleNombreComercio'].valid && this.form['calleNumeroComercio'].valid && this.form['ciudadComercio'].valid
      && this.form['calleNombreDomicilio'].valid && this.form['calleNumeroDomicilio'].valid && this.form['ciudadDomicilio'].valid;
  }

  calcularDistancia(): number {
    let ciudadDomicilio: Ciudad = ciudades.find(c => c.id === this.ciudadDomicilio) as Ciudad;
    let posicionMarcador: google.maps.LatLngLiteral = this.posicionMarcador as google.maps.LatLngLiteral;

    this.distancia = Number((google.maps.geometry.spherical.computeLength([
      ciudadDomicilio.posicion, posicionMarcador]) / 1000).toFixed(2));
    return this.distancia;
  }

  calcularTotal(): number {
    this.totalAPagar = (this.distancia / 0.5) * 250;
    if (this.totalAPagar < 250) this.totalAPagar = 250;

    this.form['montoAAbonar'].setValidators([
      Validators.min(this.totalAPagar),
      Validators.max(999999),
      conditionalValidator(() => this.formaPago === 'efectivo', Validators.required)]);

    return this.totalAPagar;
  }
}
