import { User } from '../../users/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
export declare class Favorite {
    id: string;
    userId: string;
    vehicleId: string;
    user: User;
    vehicle: Vehicle;
}
