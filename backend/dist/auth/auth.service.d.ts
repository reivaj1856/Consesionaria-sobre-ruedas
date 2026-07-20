import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: "cliente" | "admin";
            plan: "gratis" | "negocio" | "empresa";
            suscripcionFecha: string;
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
        };
    }>;
    findUserById(id: string): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: "cliente" | "admin";
        plan: "gratis" | "negocio" | "empresa";
        suscripcionFecha: string;
    }>;
    subscribe(userId: string, plan: 'gratis' | 'negocio' | 'empresa'): Promise<{
        success: boolean;
        message: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: "cliente" | "admin";
            plan: "gratis" | "negocio" | "empresa";
            suscripcionFecha: string;
        };
    }>;
    findAllUsers(): Promise<User[]>;
    updateUserPlan(id: string, plan: 'gratis' | 'negocio' | 'empresa'): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateToken;
}
