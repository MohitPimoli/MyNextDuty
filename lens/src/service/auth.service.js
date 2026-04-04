import commonService from "./commonService";
import passwordEncoder from "../util/encoder";

export const authService = {
  async login(payload) {
    try {
      const encryptedPayload = {
        ...payload,
        password: await passwordEncoder.encryptPassword(payload.password),
      };
      return commonService.AUTH.login(encryptedPayload);
    } catch (error) {
      return commonService.AUTH.login(payload);
    }
  },

  async signup(payload) {
    try {
      const encryptedPayload = {
        ...payload,
        password: await passwordEncoder.encryptPassword(payload.password),
      };

      return commonService.AUTH.signup(encryptedPayload);
    } catch (error) {
      return commonService.AUTH.signup(payload);
    }
  },

  logout() {
    return commonService.AUTH.logout();
  },

  refreshToken() {
    return commonService.AUTH.refreshToken();
  },
};
