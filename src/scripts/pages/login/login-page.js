import { getAccessToken } from '../../utils/auth';
import LoginPresenter from './login-presenter';
import Api from '../../utils/api';         // Import model API
import * as AuthModel from '../../utils/auth'; // Import auth utilities

const LoginPage = {
  async render() {
    return `
      <section class="login-page">
        <h2>Login</h2>
        <form id="login-form">
          <input type="email" id="email-input" placeholder="Email" required />
          <input type="password" id="password-input" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
        <p id="loginMessage"></p>
      </section>
    `;
  },

  async afterRender() {
    if (getAccessToken()) {
      window.location.hash = '#/home';
      return;
    }

    this.presenter = new LoginPresenter({
      view: this,
      model: Api,
      authModel: AuthModel,
    });

    const form = document.getElementById('login-form');
    const message = document.getElementById('loginMessage');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email-input').value;
      const password = document.getElementById('password-input').value;

      const result = await this.presenter.getLogin({ email, password });

      if (result.success) {
        window.location.hash = '#/home';
      } else {
        message.textContent = result.message;
      }
    });
  },

  loginSuccessfully(message) {
    console.log(message);
    window.location.hash = '#/home';
  },

  loginFailed(message) {
    alert(message);
  },

  showSubmitLoadingButton() {
    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
  },

  hideSubmitLoadingButton() {
    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    if (submitBtn) submitBtn.disabled = false;
  },
};

export default LoginPage;
