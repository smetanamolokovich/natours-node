/* eslint-disable */
import '@babel/polyfill';
import 'regenerator-runtime/runtime';

import axios from 'axios';
import { showAlert } from './alerts';

export const sendReview = async (tourID, review, rating) => {
  try {
    const res = await axios({
      url: `/api/v1/tours/${tourID}/reviews`,
      method: 'POST',
      data: {
        review,
        rating,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your review is successfully submited.');
      window.setTimeout(() => location.reload(), 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteReview = async (reviewID) => {
  try {
    const res = await axios({
      url: `/api/v1/reviews/${reviewID}`,
      method: 'DELETE',
    });

    showAlert('success', 'Successfully deleted review.');
    window.setTimeout(() => location.reload(), 1000);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
