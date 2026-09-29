
import { AuthService } from '../../core/auth';

import type {
  RegisterCredentials
} from '../../types/auth';

document.addEventListener('DOMContentLoaded', () => {
  const form =
    document.querySelector<HTMLFormElement>(
      '#register-form'
    );

  const nombre =
    document.querySelector<HTMLInputElement>('#nombre');

  const apellido =
    document.querySelector<HTMLInputElement>('#apellido');

  const email =
    document.querySelector<HTMLInputElement>('#email');

  const password =
    document.querySelector<HTMLInputElement>('#password');

  const confirmPassword =
    document.querySelector<HTMLInputElement>(
      '#confirm-password'
    );

  const submitButton =
    document.querySelector<HTMLButtonElement>(
      '#submit-btn'
    );

  const errorMessage =
    document.querySelector<HTMLElement>(
      '#error-message'
    );

  const successMessage =
    document.querySelector<HTMLElement>(
      '#success-message'
    );

  if (
    !form || !nombre || !apellido ||
    !email || !password || !confirmPassword ||
    !submitButton || !errorMessage ||
    !successMessage
  ) {
    console.error('Faltan elementos del formulario');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    errorMessage.hidden = true;
    successMessage.hidden = true;

    if (password.value !== confirmPassword.value) {
      showError('Las contraseñas no coinciden.');
      return;
    }

    const credentials: RegisterCredentials = {
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      email: email.value.trim(),
      password: password.value
    };

    if (
      !credentials.nombre ||
      !credentials.apellido ||
      !credentials.email ||
      !credentials.password
    ) {
      showError('Completa todos los campos.');
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = 'Registrando...';

      const result = await AuthService.register(credentials);

      form.reset();

      if (result.session) {
        successMessage.textContent =
          'Cuenta creada correctamente.';

        window.location.href = '/dashboard.html';
      } else {
        successMessage.textContent =
          'Si el registro se ha completado, ' +
          'recibirás un correo para confirmar tu cuenta.';
      }

      successMessage.hidden = false;

    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Error inesperado durante el registro.';

      showError(message);

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Crear cuenta';
    }
  });

  function showError(message: string) {
    errorMessage!.textContent = message;
    errorMessage!.hidden = false;
  }
});