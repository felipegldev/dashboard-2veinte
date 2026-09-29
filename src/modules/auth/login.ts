// Lógica del login
import { AuthService } from '../../core/auth';
import { LoginCredentials } from '../types/auth';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector<HTMLFormElement>('#login-form');
  const emailInput = document.querySelector<HTMLInputElement>('#email');
  const passwordInput = document.querySelector<HTMLInputElement>('#password');
  const errorMessage = document.querySelector<HTMLDivElement>('#error-message');
  const submitButton = document.querySelector<HTMLButtonElement>('#submit-btn');

  // Redirigir si ya está autenticado
  if (AuthService.isAuthenticated()) {
    window.location.href = '/dashboard.html';
    return;
  }

  if (!loginForm || !emailInput || !passwordInput || !submitButton) {
    console.error('No se encontraron elementos requeridos del DOM en el Login.');
    return;
  }

  loginForm.addEventListener('submit', async (event: SubmitEvent) => {
    event.preventDefault();

    const credentials: LoginCredentials = {
      email: emailInput.value.trim(),
      password: passwordInput.value,
    };

    // Validación básica de campos
    if (!credentials.email || !credentials.password) {
      showError('Por favor, completa todos los campos.');
      return;
    }

    try {
      setLoading(true);
      clearError();

      await AuthService.login(credentials);

      // Redirección exitosa al Dashboard
      window.location.href = '/dashboard.html';
    } catch (err) {
      const error = err as Error;
      showError(error.message);
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading: boolean): void {
    if (!submitButton) return;
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión';
  }

  function showError(msg: string): void {
    if (!errorMessage) return;
    errorMessage.textContent = msg;
    errorMessage.style.display = 'block';
  }

  function clearError(): void {
    if (!errorMessage) return;
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
  }
});