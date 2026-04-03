import { iTokenSaver } from './createTokenSaver';
import { defer, DFD } from '@peryl/utils/defer';
import { login } from './login';
import Axios from 'axios';
import env from './env';

export function createTokenService(tokenSaver: iTokenSaver) {
  const pureAxios = Axios.create({ baseURL: env.baseURL });

  /*获取token的调用方进入到这里数组排队获取token*/
  let waitingDfd = null as null | DFD<string>;

  const getToken = async (): Promise<string> => {
    /*当前正在刷新token，进入等待队列*/
    if (waitingDfd) {
      return waitingDfd.promise;
    }

    const tokenInfo = tokenSaver.get();

    /*1、没有token信息的话，重新登录*/
    if (!tokenInfo) {
      login();
      throw new Error('登录已经过期，重新登录 (0x01)');
    }

    /*2、access_token前端判断仍然未过期，直接使用*/
    if (!tokenInfo.isAccessExpired()) {
      return tokenInfo.access_token;
    }

    /*3、access_token已经过期，尝试使用refresh_token刷新，如果refresh_token也已经过期，则返回登录*/
    if (tokenInfo.isRefreshExpired()) {
      login();
      throw new Error('登录已经过期，重新登录 (0x02)');
    }

    waitingDfd = defer<string>();

    /*4、调用refresh接口获取新的access_token*/
    try {
      const resp = await pureAxios.request<{ access_token: string; access_expires: number }>({
        method: 'post',
        url: '/refresh',
        data: { refresh_token: tokenInfo.refresh_token },
      });
      console.log('resp.data', resp.data);
      tokenSaver.saveAccessToken(resp.data.access_token, resp.data.access_expires);
      waitingDfd.resolve(resp.data.access_token);
      return resp.data.access_token;
    } catch (e) {
      console.error(e);
      waitingDfd.reject(new Error('refresh token failed.'));
      login();
      throw e;
    } finally {
      waitingDfd = null;
    }
  };
  return {
    getToken,
  };
}

export type iTokenService = ReturnType<typeof createTokenService>;
