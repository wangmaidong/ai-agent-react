import {iTokenSaver} from "./createTokenSaver";
import {Axios} from "axios";
import env from "./env";
import {login} from "./login";

const pureAxios = new Axios({ baseURL: env.baseURL });

export function createTokenService(tokenSaver: iTokenSaver) {

  /**
   * access token过期时间一般是30分钟到2小时，但是refresh token过期时间一般是7天；（一些网站上登录有复选框，XX天免登录）
   * access token：很容易暴露；
   * refresh token：不容易暴露；
   *
   * token获取有这四种情况：
   * 1. 缓存就没有token；——>> 登录
   * 2. 缓存有token，但是access token过期，但是refresh token没有过期；——调用refresh接口，用refresh token拿一个新的access  token;
   * 3. 缓存有token，但是access token过期，refresh token也过期了； ——>> 登录
   * 4. 缓存有token，都没有过期 -->> 返回access token；
   * @author  韦胜健
   * @date    2026-03-29 11:16
   */

  const getToken = async (): Promise<string> => {

    const tokenInfo = tokenSaver.get();

    // 1. 缓存就没有token；——>> 登录
    if (!tokenInfo) {
      login();
      throw new Error('登录已经过期，需要重新登陆(0x01)');
    }

    // 2. 访问token没过期，直接返回
    if (!tokenInfo.isAccessExpired()) {
      return tokenInfo.access_token;
    }

    // 3. 都过期了
    if (tokenInfo.isRefreshExpired()) {
      login();
      throw new Error('登录已经过期，需要重新登陆(0x02)');
    }

    // 4. access token过期，refresh token没过期，用refresh token拿一个新的access  token;
    try {
      const resp = await pureAxios.post<iTokenRefreshResponseData>('/refresh', {
        refresh_token: tokenInfo.refresh_token,
      });
      tokenSaver.saveAccessToken(resp.data.access_token, resp.data.access_expires);
      return resp.data.access_token;
    } catch (e) {
      login();
      throw e;
    }

  };

  return { getToken };
}

export type iTokenService = ReturnType<typeof createTokenService>

/*调用刷新token接口返回的数据类型*/
export interface iTokenRefreshResponseData {
  access_token: string, // 新的访问token
  access_expires: number, // 新访问token的过期时间戳 比如60*1000（1分钟之后过期）
}
