// src/scripts/presenters/register-presenter.js
import Api from '../../utils/api';

const RegisterPresenter = {
  async registerUser({ name, email, password }) {
    try {
      const response = await Api.register({ name, email, password });

      if (!response.error) {
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      return { success: false, message: 'Terjadi kesalahan: ' + err.message };
    }
  }
};

export default RegisterPresenter;
