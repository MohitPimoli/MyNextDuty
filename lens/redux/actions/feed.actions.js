import commonService from '@/service/commonService';
import {
  FEED_FETCH_REQUEST, FEED_FETCH_SUCCESS, FEED_FETCH_FAILURE,
  FEED_SET_FILTER, FEED_APPEND_RECOMMENDATIONS,
  FEED_PROFILE_REQUEST, FEED_PROFILE_SUCCESS, FEED_PROFILE_FAILURE,
} from '@/util/constants';

const SERVICE_MAP = {
  'personalized': () => commonService.RECOMMENDATION.getPersonalized(),
  'life-stage':   () => commonService.RECOMMENDATION.getByLifeStage(),
  'interests':    () => commonService.RECOMMENDATION.getByInterests(),
  'critical':     () => commonService.RECOMMENDATION.getCritical(),
};

export const fetchRecommendations = (filter) => async (dispatch) => {
  dispatch({ type: FEED_FETCH_REQUEST });
  try {
    const res = await SERVICE_MAP[filter]();
    dispatch({ type: FEED_FETCH_SUCCESS, payload: res.data.data });
  } catch (err) {
    dispatch({
      type: FEED_FETCH_FAILURE,
      payload: err?.response?.data?.message ?? 'Failed to load recommendations',
    });
  }
};

export const loadMoreRecommendations = () => async (dispatch) => {
  dispatch({ type: FEED_FETCH_REQUEST });
  try {
    const res = await commonService.RECOMMENDATION.getPersonalized();
    dispatch({ type: FEED_APPEND_RECOMMENDATIONS, payload: res.data.data });
  } catch (err) {
    dispatch({
      type: FEED_FETCH_FAILURE,
      payload: err?.response?.data?.message ?? 'Failed to load recommendations',
    });
  }
};

export const setFeedFilter = (filter) => (dispatch) => {
  dispatch({ type: FEED_SET_FILTER, payload: filter });
  dispatch(fetchRecommendations(filter));
};

export const fetchUserProfile = () => async (dispatch) => {
  dispatch({ type: FEED_PROFILE_REQUEST });
  try {
    const res = await commonService.USER.getProfile();
    dispatch({ type: FEED_PROFILE_SUCCESS, payload: res.data.data });
  } catch (err) {
    dispatch({
      type: FEED_PROFILE_FAILURE,
      payload: err?.response?.data?.message ?? 'Failed to load profile',
    });
  }
};
