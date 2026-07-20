export interface Specification {
  id: number;
  nombre: string;
  grupoId: number;
  grupo?: SpecificationGroup;
}

export interface SpecificationGroup {
  id: number;
  nombre: string;
  especificaciones?: Specification[];
}

export interface AutoDetail {
  id?: string;
  carroceria: string;
  puertas: number;
  pasajeros: number;
}

export interface MotoDetail {
  id?: string;
  cilindrada: number;
  tipoMoto: string;
}

export interface MaquinariaDetail {
  id?: string;
  pesoOperativo: number;
  horasUso: number;
}

export interface Vehicle {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  categoria: 'autos' | 'motos' | 'maquinaria';
  tipoCombustible: string;
  transmision: string;
  kilometraje: number;
  condicion: 'nuevo' | 'usado';
  ubicacion: string;
  imagenPrincipal: string;
  imagenes: string[];
  descripcion: string;
  destacado: boolean;
  estado: 'disponible' | 'reservado' | 'vendido';
  fechaIngreso: string;
  especificaciones: Specification[];
  autoDetail?: AutoDetail;
  motoDetail?: MotoDetail;
  maquinariaDetail?: MaquinariaDetail;
}
