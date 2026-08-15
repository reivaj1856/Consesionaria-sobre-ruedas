export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'administrador' | 'concesionaria' | 'agente';
  concesionariaId?: string | null;
  concesionaria?: { id: string; nombre: string } | null;
  beneficios?: number;
  recibeDolares?: boolean;
  recibeBolivianos?: boolean;
}
