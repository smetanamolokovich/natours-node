/* eslint-disable */
import '@babel/polyfill';
import 'regenerator-runtime/runtime';

import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const endpoint = `${
      type === 'password' ? 'update-my-password' : 'update-me'
    }`;

    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${endpoint}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type === 'password' ? 'Password' : 'Data'} updated successfully!`
      );
      // window.setTimeout(() => {
      //   location.assign('/me');
      // }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
