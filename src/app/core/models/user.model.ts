export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'cliente' | 'admin';
  plan?: 'gratis' | 'negocio' | 'empresa';
  suscripcionFecha?: string;
  recibeDolares?: boolean;
  recibeBolivianos?: boolean;
}
