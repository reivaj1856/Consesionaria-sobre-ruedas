import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Setting } from '../users/entities/setting.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly settingRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, settingRepository: Repository<Setting>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: "agente" | "administrador" | "concesionaria";
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
            rol: "agente" | "administrador" | "concesionaria";
            concesionariaId: string | null;
            beneficios: number;
            recibeDolares: boolean;
            recibeBolivianos: boolean;
        };
    }>;
    findUserById(id: string): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: "agente" | "administrador" | "concesionaria";
        concesionariaId: string | null;
        concesionaria: {
            id: string;
            nombre: string;
        } | null;
        beneficios: number;
        recibeDolares: boolean;
        recibeBolivianos: boolean;
    }>;
    findConcesionarias(): Promise<User[]>;
    getBeneficioSetting(): Promise<{
        valor: number;
    }>;
    updateBeneficioSetting(valor: number): Promise<{
        success: boolean;
        valor: number;
    }>;
    findAllUsers(): Promise<User[]>;
    adminUpdateUser(id: string, updateData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateToken;
}
