import {
  FEED_FETCH_REQUEST, FEED_FETCH_SUCCESS, FEED_FETCH_FAILURE,
  FEED_SET_FILTER, FEED_APPEND_RECOMMENDATIONS,
  FEED_PROFILE_REQUEST, FEED_PROFILE_SUCCESS, FEED_PROFILE_FAILURE,
} from '@/util/constants';

const initialState = {
  recommendations: [],
  loading: false,
  error: null,
  activeFilter: 'personalized',
  userProfile: null,
  profileLoading: false,
  profileError: null,
};

export const feedReducer = (state = initialState, action) => {
  switch (action.type) {
    case FEED_FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case FEED_FETCH_SUCCESS:
      return { ...state, loading: false, recommendations: action.payload };
    case FEED_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FEED_SET_FILTER:
      return { ...state, activeFilter: action.payload, recommendations: [], loading: false, error: null };
    case FEED_APPEND_RECOMMENDATIONS:
      return { ...state, loading: false, recommendations: [...state.recommendations, ...action.payload] };
    case FEED_PROFILE_REQUEST:
      return { ...state, profileLoading: true, profileError: null };
    case FEED_PROFILE_SUCCESS:
      return { ...state, profileLoading: false, userProfile: action.payload };
    case FEED_PROFILE_FAILURE:
      return { ...state, profileLoading: false, profileError: action.payload };
    default:
      return state;
  }
};
