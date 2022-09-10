import {Ciudad, ciudades} from "./ciudad";

export interface DireccionEntrega {
  calleNombre: string;
  calleNumero: number;
  ciudad: Ciudad
}

export const direccionesEntrega: DireccionEntrega[] = [
  {
    calleNombre: 'Calderón de la Barça',
    calleNumero: 425,
    ciudad: ciudades[0]
  },
  {
    calleNombre: 'Laprida',
    calleNumero: 235,
    ciudad: ciudades[0]
  },
  {
    calleNombre: 'Av. Simón Laplace',
    calleNumero: 5355,
    ciudad: ciudades[0]
  },
  {
    calleNombre: 'Av. Colón',
    calleNumero: 359,
    ciudad: ciudades[0]
  },
  {
    calleNombre: 'Buenos Aires',
    calleNumero: 356,
    ciudad: ciudades[0]
  },
  {
    calleNombre: 'Dean Funes',
    calleNumero: 450,
    ciudad: ciudades[1]
  },
  {
    calleNombre: 'Salta',
    calleNumero: 65,
    ciudad: ciudades[1]
  },
  {
    calleNombre: 'Blvd. Roque Sáenz Peña',
    calleNumero: 650,
    ciudad: ciudades[1]
  },
  {
    calleNombre: 'Lopez y Planes',
    calleNumero: 27,
    ciudad: ciudades[1]
  },
  {
    calleNombre: 'Belgrano',
    calleNumero: 97,
    ciudad: ciudades[1]
  },
  {
    calleNombre: 'Uruguay',
    calleNumero: 156,
    ciudad: ciudades[2]
  },
  {
    calleNombre: 'Jujuy',
    calleNumero: 258,
    ciudad: ciudades[2]
  },
  {
    calleNombre: 'Jorge Newbery',
    calleNumero: 87,
    ciudad: ciudades[2]
  },
  {
    calleNombre: 'Catamarca',
    calleNumero: 485,
    ciudad: ciudades[2]
  },
  {
    calleNombre: 'Av. Argentina',
    calleNumero: 55,
    ciudad: ciudades[2]
  }
]
