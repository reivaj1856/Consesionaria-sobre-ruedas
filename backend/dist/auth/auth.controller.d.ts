import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: "agente" | "admin" | "administrador" | "concesionaria" | "cliente";
            concesionariaId: string | null;
            beneficios: number;
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
            rol: "agente" | "admin" | "administrador" | "concesionaria" | "cliente";
            concesionariaId: string | null;
            beneficios: number;
            recibeDolares: boolean;
            recibeBolivianos: boolean;
        };
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: "agente" | "admin" | "administrador" | "concesionaria" | "cliente";
        concesionariaId: string | null;
        concesionaria: {
            id: string;
            nombre: string;
        } | null;
        beneficios: number;
        recibeDolares: boolean;
        recibeBolivianos: boolean;
    }>;
    findConcesionarias(): Promise<import("../users/entities/user.entity").User[]>;
    getBeneficioSetting(): Promise<{
        valor: number;
    }>;
    updateBeneficioSetting(valor: number): Promise<{
        success: boolean;
        valor: number;
    }>;
    findAllUsers(): Promise<import("../users/entities/user.entity").User[]>;
    adminUpdateUser(id: string, updateData: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
