import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SubscribeDto } from '../users/dto/subscribe.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: "cliente" | "admin";
            plan: "gratis" | "negocio" | "empresa";
            suscripcionFecha: string;
            recibeDolares: boolean;
            recibeBolivianos: boolean;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: "cliente" | "admin";
            plan: "gratis" | "negocio" | "empresa";
            suscripcionFecha: string;
            recibeDolares: boolean;
            recibeBolivianos: boolean;
        };
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: "cliente" | "admin";
        plan: "gratis" | "negocio" | "empresa";
        suscripcionFecha: string;
        recibeDolares: boolean;
        recibeBolivianos: boolean;
    }>;
    subscribe(req: any, subscribeDto: SubscribeDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: "cliente" | "admin";
            plan: "gratis" | "negocio" | "empresa";
            suscripcionFecha: string;
            recibeDolares: boolean;
            recibeBolivianos: boolean;
        };
    }>;
    findAllUsers(): Promise<import("../users/entities/user.entity").User[]>;
    updateUserPlan(id: string, plan: 'gratis' | 'negocio' | 'empresa'): Promise<{
        success: boolean;
        message: string;
    }>;
}
