import { Vehicle } from '../../vehicles/entities/vehicle.entity';
export declare class Quote {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    mensaje: string;
    vehicleId: string;
    fecha: string;
    vehicle: Vehicle;
}
