export type UserRole = 'admin' | 'tecnico';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  nombre: string;
  apellido: string;
  cargo: UserRole;
  created_at: string;
}