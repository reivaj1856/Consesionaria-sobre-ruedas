"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, contrasenia, nombre } = registerDto;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.BadRequestException('El correo electrónico ya está registrado.');
        }
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        const newUser = this.userRepository.create({
            email,
            contrasenia: hashedPassword,
            nombre,
            rol: 'cliente',
            plan: 'gratis',
            suscripcionFecha: new Date().toISOString().split('T')[0],
            recibeDolares: registerDto.recibeDolares !== undefined ? registerDto.recibeDolares : true,
            recibeBolivianos: registerDto.recibeBolivianos !== undefined ? registerDto.recibeBolivianos : true,
        });
        const savedUser = await this.userRepository.save(newUser);
        const token = this.generateToken(savedUser);
        return {
            token,
            user: {
                id: savedUser.id,
                email: savedUser.email,
                nombre: savedUser.nombre,
                rol: savedUser.rol,
                plan: savedUser.plan,
                suscripcionFecha: savedUser.suscripcionFecha,
                recibeDolares: savedUser.recibeDolares,
                recibeBolivianos: savedUser.recibeBolivianos,
            },
        };
    }
    async login(loginDto) {
        const { email, contrasenia } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas.');
        }
        const isPasswordMatching = await bcrypt.compare(contrasenia, user.contrasenia);
        if (!isPasswordMatching) {
            throw new common_1.UnauthorizedException('Credenciales inválidas.');
        }
        const token = this.generateToken(user);
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                rol: user.rol,
                plan: user.plan,
                suscripcionFecha: user.suscripcionFecha,
                recibeDolares: user.recibeDolares,
                recibeBolivianos: user.recibeBolivianos,
            },
        };
    }
    async findUserById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado.');
        }
        return {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            rol: user.rol,
            plan: user.plan,
            suscripcionFecha: user.suscripcionFecha,
            recibeDolares: user.recibeDolares,
            recibeBolivianos: user.recibeBolivianos,
        };
    }
    async subscribe(userId, plan) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado.');
        }
        user.plan = plan;
        user.suscripcionFecha = new Date().toISOString().split('T')[0];
        await this.userRepository.save(user);
        return {
            success: true,
            message: `Plan actualizado a ${plan} con éxito.`,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                rol: user.rol,
                plan: user.plan,
                suscripcionFecha: user.suscripcionFecha,
                recibeDolares: user.recibeDolares,
                recibeBolivianos: user.recibeBolivianos,
            }
        };
    }
    async findAllUsers() {
        return this.userRepository.find({
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                plan: true,
                suscripcionFecha: true,
                recibeDolares: true,
                recibeBolivianos: true
            },
            order: { nombre: 'ASC' }
        });
    }
    async updateUserPlan(id, plan) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.BadRequestException('Usuario no encontrado.');
        }
        user.plan = plan;
        user.suscripcionFecha = new Date().toISOString().split('T')[0];
        await this.userRepository.save(user);
        return {
            success: true,
            message: `Plan del usuario ${user.nombre} actualizado a ${plan} con éxito.`
        };
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email, nombre: user.nombre, rol: user.rol, plan: user.plan };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map