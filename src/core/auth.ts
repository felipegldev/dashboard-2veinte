// Definición de tipos y interfaces para la autenticación

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthError {
  message: string;
  status?: number;
}

// src/core/auth.ts
import { LoginCredentials, AuthResponse, User } from '../types/auth';

const TOKEN_KEY = '2veinte_auth_token';
const USER_KEY = '2veinte_user_data';
const API_URL = 'https://api.2veinte.com'; // Sustituir por la URL real de tu API o Supabase

export class AuthService {
  /**
   * Envía las credenciales al backend para autenticar al usuario
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    }

    const data: AuthResponse = await response.json();
    this.saveSession(data.token, data.user);
    return data;
  }

  /**
   * Almacena el token y los datos de usuario en localStorage
   */
  private static saveSession(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Obtiene el token guardado
   */
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Obtiene el usuario autenticado actualmente
   */
  static getCurrentUser(): User | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Verifica si hay una sesión activa
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Cierra la sesión activa y borra el almacenamiento local
   */
  static logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/login.html';
  }
}