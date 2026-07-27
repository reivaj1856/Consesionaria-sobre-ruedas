import { Vehicle } from './vehicle.entity';
export declare class MotoDetail {
    id: string;
    cilindrada: number;
    tipoMoto: string;
    autonomia: number | null;
    tamanoBateria: number | null;
    vehicle: Vehicle;
}
