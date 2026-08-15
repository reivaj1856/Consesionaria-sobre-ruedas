export declare class RegisterDto {
    nombre: string;
    email: string;
    contrasenia: string;
    rol: 'administrador' | 'concesionaria' | 'agente';
    concesionariaId?: string;
    recibeDolares?: boolean;
    recibeBolivianos?: boolean;
}
