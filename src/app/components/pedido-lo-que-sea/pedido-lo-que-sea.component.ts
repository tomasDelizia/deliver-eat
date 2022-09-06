import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-pedido-lo-que-sea',
  templateUrl: './pedido-lo-que-sea.component.html',
  styleUrls: ['./pedido-lo-que-sea.component.css']
})
export class PedidoLoQueSeaComponent implements OnInit {
  titulo: string = 'Realizar un pedido de lo que sea';

  ciudades: string[] = ['Córdoba', 'San Francisco', 'Villa General Belgrano'];
  momentosEntrega: string[] = ['Lo antes posible', 'Programar ahora'];
  formasPago: string[] = ['Efectivo', 'Tarjeta de Crédito MasterCard'];

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
      descripcionPedido: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      imagen: [
        null,
        []
      ],
      calleNombreComercio: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      calleNumeroComercio: [
        null,
        [Validators.required, Validators.pattern("[0-9]{1,5}")]],
      ciudadComercio: ['Córdoba', Validators.required],
      referenciaComercio: [
        null,
        [Validators.minLength(3), Validators.maxLength(50)]],
      calleNombreDomicilio: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      calleNumeroDomicilio: [
        null,
        [Validators.required, Validators.pattern("[0-9]{1,5}")]],
      pisoDomicilio: [
        null,
        Validators.pattern("[0-9]{1,2}")],
      deptoDomicilio: [
        null,
        Validators.pattern("[A-Z]{1}")],
      ciudadDomicilio: ['Córdoba', Validators.required],
      referenciaDomicilio: [
        null,
        [Validators.minLength(3), Validators.maxLength(50)]],
      momentoEntrega: ['Lo antes posible', Validators.required],
      fechaEntrega: [
        null],
      horaEntrega: [
        null],
      formaPago: ['Efectivo'],
      montoAAbonar: [
        null,
        [Validators.min(50), Validators.max(999999)]],
      nroTarjeta: [
        null,
        Validators.pattern("5[0-5]{1}[0-9]{14}")],
      titularTarjeta: [
        null,
        [Validators.minLength(4), Validators.maxLength(50)]],
      fechaVencimientoTarjeta: [
        null,
        [Validators.pattern('(1[012][-/]2022)|((0[1-9]|1[012])[-/]20(2[3-9]{1}|[3-9]{2}))')]],
      codigoSeguridadTarjeta: [
        null,
        Validators.pattern('[0-9]{3}')
      ]
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
}
