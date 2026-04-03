import {Axios} from "axios";
import env from "./env";
import {showError} from "../utils/showError";
import {iTokenService} from "./createTokenService";
import {login} from "./login";

export function createHttp(tokenService: iTokenService, defaultSetToken: boolean) {
  const http = new Axios({
    baseURL: env.baseURL
  });
  http.interceptors.request.use(async (config) => {

    const setToken = config.setToken ?? defaultSetToken;
    if (setToken) {
      const token = await tokenService.getToken();
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  });

  http.interceptors.response.use(
    resp => resp,
    async (e) => {
      /*当前是否处于登录页面*/
      const isCurrentLoginPage = window.location.pathname.indexOf('public/login') > -1;
      /*如果不是登录页面，出现401错误请求，自动跳转到登录页面，登录成功之后回到当前页面*/
      if (e.status === 401) {
        if (!isCurrentLoginPage) {
          showError("登录已经过期，重新登录 (0x03)");
          login();
        }
      }
      throw e;
    }
  );

  return http;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    /*可以通过axios request config来设置是否设置请求头中的token*/
    setToken?: boolean;
  }
}
