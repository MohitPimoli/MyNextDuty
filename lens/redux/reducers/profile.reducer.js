import {
  PROFILE_FETCH_REQUEST, PROFILE_FETCH_SUCCESS, PROFILE_FETCH_FAILURE,
  PROFILE_UPDATE_REQUEST, PROFILE_UPDATE_SUCCESS, PROFILE_UPDATE_FAILURE,
} from '@/util/constants';

const initialState = {
  data: null,
  loading: false,
  error: null,
  fetchedAt: null,
  updateLoading: false,
  updateError: null,
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case PROFILE_FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null, fetchedAt: Date.now() };
    case PROFILE_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case PROFILE_UPDATE_REQUEST:
      return { ...state, updateLoading: true, updateError: null };
    case PROFILE_UPDATE_SUCCESS:
      return { ...state, updateLoading: false, data: action.payload, updateError: null };
    case PROFILE_UPDATE_FAILURE:
      return { ...state, updateLoading: false, updateError: action.payload };
    default:
      return state;
  }
};
