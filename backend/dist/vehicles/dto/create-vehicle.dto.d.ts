export declare class CreateVehicleDto {
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
    especificaciones: number[];
    autoDetail?: {
        carroceria: string;
        puertas: number;
        pasajeros: number;
    };
    motoDetail?: {
        cilindrada: number;
        tipoMoto: string;
    };
    maquinariaDetail?: {
        pesoOperativo: number;
        horasUso: number;
    };
    tieneTour?: boolean;
    imagen360?: string;
    hotspots?: any[];
}
