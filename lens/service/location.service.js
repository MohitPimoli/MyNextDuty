import commonService from "./commonService";

export const locationService = {
  getLocation(userId) {
    return commonService.LOCATION.getUserLocation(userId);
  },
};

export const updateUserLocation = (userId, payload) => {
  return commonService.LOCATION.updateUserLocation(userId, payload);
};

export const getNearbyUsers = (userId, radius) => {
  return commonService.LOCATION.getNearbyUsers(userId, radius);
};
