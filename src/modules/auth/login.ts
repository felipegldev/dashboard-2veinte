
import { AuthService } from '../../core/auth';
import type { LoginCredentials } from '../../types/auth';

document.addEventListener('DOMContentLoaded', async () => {
  const loginForm =
    document.querySelector<HTMLFormElement>('#login-form');

  const emailInput =
    document.querySelector<HTMLInputElement>('#email');

  const passwordInput =
    document.querySelector<HTMLInputElement>('#password');

  const errorMessage =
    document.querySelector<HTMLDivElement>('#error-message');

  const submitButton =
    document.querySelector<HTMLButtonElement>('#submit-btn');

  if (
    !loginForm ||
    !emailInput ||
    !passwordInput ||
    !submitButton
  ) {
    console.error('Faltan elementos del formulario');
    return;
  }

  // Verificar sesión existente
  if (await AuthService.isAuthenticated()) {
    window.location.replace('/dashboard.html');
    return;
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const credentials: LoginCredentials = {
      email: emailInput.value.trim(),
      password: passwordInput.value
    };

    if (!credentials.email || !credentials.password) {
      showError('Completa todos los campos.');
      return;
    }

    try {
      setLoading(true);
      clearError();

      await AuthService.login(credentials);

      window.location.replace('/dashboard.html');

    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : 'Ocurrió un error inesperado.';

      showError(message);

    } finally {
      setLoading(false);
    }
  });

  function setLoading(loading: boolean) {
    submitButton!.disabled = loading;
    submitButton!.textContent = loading
      ? 'Iniciando sesión...'
      : 'Iniciar Sesión';
  }

  function showError(message: string) {
    if (!errorMessage) return;
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  function clearError() {
    if (!errorMessage) return;
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
  }
});