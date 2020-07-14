/* eslint-disable */
import '@babel/polyfill';
import 'regenerator-runtime/runtime';

import axios from 'axios';
import { showAlert } from './alerts';

export const register = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/sign-up',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'You signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
