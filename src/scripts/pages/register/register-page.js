// src/scripts/pages/register-page.js
import RegisterPresenter from './register-presenter';

const RegisterPage = {
  async render() {
    return `
      <section>
        <h2>Register</h2>
        <form id="registerForm">
          <label for="name">Nama:</label>
          <input type="text" id="name" name="name" required />
          
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />
          
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required minlength="8" autocomplete="new-password" />
          
          <button type="submit">Daftar</button>
        </form>
        <p>Sudah punya akun? <a href="#/">Login di sini</a></p>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;

      if (!name || !email || !password) {
        alert('Semua kolom harus diisi dengan benar.');
        return;
      }

      try {
        const result = await RegisterPresenter.registerUser({ name, email, password });

        if (result.success) {
          alert('Registrasi berhasil! Silakan login.');
          window.location.hash = '#/login';
        } else {
          alert('Gagal registrasi: ' + (result.message || 'Terjadi kesalahan.'));
        }
      } catch (error) {
        alert('Terjadi kesalahan: ' + error.message);
      }
    });
  }
};

export default RegisterPage;
