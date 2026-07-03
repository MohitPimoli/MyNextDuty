import commonService from '@/service/commonService';
import toastService from '@/util/toastService';
import {
  PROFILE_FETCH_REQUEST, PROFILE_FETCH_SUCCESS, PROFILE_FETCH_FAILURE,
  PROFILE_UPDATE_REQUEST, PROFILE_UPDATE_SUCCESS, PROFILE_UPDATE_FAILURE,
} from '@/util/constants';

const STALE_THRESHOLD_MS = 300_000; // 5 minutes

export const fetchProfile = () => async (dispatch, getState) => {
  const { fetchedAt } = getState().profile;
  if (fetchedAt && Date.now() - fetchedAt < STALE_THRESHOLD_MS) return;

  dispatch({ type: PROFILE_FETCH_REQUEST });
  try {
    const res = await commonService.USER.getProfile();
    dispatch({ type: PROFILE_FETCH_SUCCESS, payload: res.data.data });
  } catch (err) {
    dispatch({
      type: PROFILE_FETCH_FAILURE,
      payload: err?.response?.data?.message ?? 'Failed to load profile',
    });
  }
};

export const updateProfile = (payload) => async (dispatch) => {
  dispatch({ type: PROFILE_UPDATE_REQUEST });
  try {
    const res = await commonService.USER.updateProfile(payload);
    dispatch({ type: PROFILE_UPDATE_SUCCESS, payload: res.data.data });
    toastService.success('Profile updated successfully.');
  } catch (err) {
    dispatch({
      type: PROFILE_UPDATE_FAILURE,
      payload: err?.response?.data?.message ?? 'Failed to update profile',
    });
  }
};
