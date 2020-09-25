/* eslint-disable */
import '@babel/polyfill';
import 'regenerator-runtime/runtime';

import axios from 'axios';
import { showAlert } from './alerts';

export const confirmEmail = async (emailToken) => {
  try {
    const res = await axios(`/api/v1/users/confirm-email/${emailToken}`);

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
