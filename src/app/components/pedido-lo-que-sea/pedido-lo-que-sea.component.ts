import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-pedido-lo-que-sea',
  templateUrl: './pedido-lo-que-sea.component.html',
  styleUrls: ['./pedido-lo-que-sea.component.css']
})
export class PedidoLoQueSeaComponent implements OnInit {
  titulo: string = 'Realizar un pedido de lo que sea';

  urlImagen: string;

  esDepto: boolean = false;

  formPedido: FormGroup;

  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() { }

  get form() {
    return this.formPedido.controls;
  }

  private buildForm(): void {
    this.formPedido = this.formBuilder.group({
      descripcionPedido: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      imagen: [null],
      origenImagen: [null, Validators.required],
      calleNombreComercio: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      calleNumeroComercio: [null, [Validators.required, Validators.pattern("[0-9]{1,5}")]],
      ciudadComercio: [null, [Validators.required]],
      referenciaComercio: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      calleNombreDomicilio: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      calleNumeroDomicilio: [null, [Validators.required, Validators.pattern("[0-9]{1,5}")]],
      pisoDepto: [null, [Validators.required, Validators.pattern("[0-9]{1,2}")]],
      letraDepto: [null, Validators.pattern("[A-Z]{1}")],
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

  onEsDeptoChange() {
    this.esDepto = !this.esDepto;
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
