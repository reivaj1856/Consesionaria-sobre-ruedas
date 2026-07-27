import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, contrasenia, nombre } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
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

  async login(loginDto: LoginDto) {
    const { email, contrasenia } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isPasswordMatching = await bcrypt.compare(contrasenia, user.contrasenia);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciales inválidas.');
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

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
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

  async subscribe(userId: string, plan: 'gratis' | 'negocio' | 'empresa') {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
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

  async updateUserPlan(id: string, plan: 'gratis' | 'negocio' | 'empresa') {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }
    user.plan = plan;
    user.suscripcionFecha = new Date().toISOString().split('T')[0];
    await this.userRepository.save(user);
    return {
      success: true,
      message: `Plan del usuario ${user.nombre} actualizado a ${plan} con éxito.`
    };
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, nombre: user.nombre, rol: user.rol, plan: user.plan };
    return this.jwtService.sign(payload);
  }
}
