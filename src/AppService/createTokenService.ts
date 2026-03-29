import {iTokenSaver} from "./createTokenSaver";
import {defer, DFD} from '@peryl/utils/defer';
import {login} from "./login";
import {Axios} from "axios";
import env from "./env";

export function createTokenService(tokenSaver: iTokenSaver) {
  const pureAxios = new Axios({ baseURL: env.baseURL });

  /*变量标识，判断当前是否正在刷新token*/
  let refreshing = false;

  /*获取token的调用方进入到这里数组排队获取token*/
  const refreshObserverList: DFD<string>[] = [];

  const getToken = async (): Promise<string> => {

    /*当前正在刷新token，进入等待队列*/
    if (refreshing) {
      const dfd = defer<string>();
      refreshObserverList.push(dfd);
      return dfd.promise;
    }

    const tokenInfo = tokenSaver.get();

    /*1、没有token信息的话，重新登录*/
    if (!tokenInfo) {
      login();
      throw new Error("登录已经过期，重新登录 (0x01)");
    }

    /*2、access_token前端判断仍然未过期，直接使用*/
    if (!tokenInfo.isAccessExpired()) {
      return tokenInfo.access_token;
    }

    /*3、access_token已经过期，尝试使用refresh_token刷新，如果refresh_token也已经过期，则返回登录*/
    if (tokenInfo.isRefreshExpired()) {
      login();
      throw new Error("登录已经过期，重新登录 (0x02)");
    }

    refreshing = true;

    /*4、调用refresh接口获取新的access_token*/
    try {
      const resp = await pureAxios.post<{ access_token: string, access_expires: number }>(
        '/refresh',
        { "refresh_token": tokenInfo.refresh_token },
      );
      console.log('resp.data', resp.data);
      tokenSaver.saveAccessToken(resp.data.access_token, resp.data.access_expires);
      refreshObserverList.forEach(i => i.resolve(resp.data.access_token));
      return resp.data.access_token;
    } catch (e) {
      console.error(e);
      refreshObserverList.forEach(i => i.reject(new Error('refresh token failed.')));
      login();
      throw e;
    } finally {
      refreshing = false;
      refreshObserverList.splice(0, refreshObserverList.length);
    }
  };
  return {
    getToken,
  };
}

export type iTokenService = ReturnType<typeof createTokenService>;
