import { supabase } from './supabase';
import type { LoginCredentials, RegisterCredentials } from '../types/auth';

export class AuthService {

  // Iniciar sesión
  static async login(credentials: LoginCredentials) {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async register(credentials: RegisterCredentials) {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        nombre: credentials.nombre,
        apellido: credentials.apellido
      }
    }
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
    }

  // Obtener el usuario autenticado
  static async getCurrentUser() {
    const { data, error } =
      await supabase.auth.getUser();

    if (error) return null;

    return data.user;
  }

  // Comprobar si existe una sesión válida
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // Cerrar sesión
  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    window.location.href = '/login.html';
  }
}