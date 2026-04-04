import axios from "axios";
import { setupInterceptors } from "../interceptors";

const api = axios.create({
  withCredentials: true,
});
setupInterceptors(api);

export default api;
