import {useCallback, useState} from "react";
import Axios from "axios";
import env from "../AppService/env";
import {createTokenSaver} from "../AppService/createTokenSaver";
import {createTokenService} from "../AppService/createTokenService";
import {Button} from "antd";
import {login} from "../AppService/login";

const http = Axios.create({ baseURL: env.baseURL });

export default () => {

  const [tokenSaver] = useState(() => createTokenSaver("pages"));
  const [tokenService] = useState(() => createTokenService(tokenSaver));

  const getUser = useCallback(async () => {
    const resp = await http.get('/users/me', {
      headers: {
        Authorization: `Bearer ${await tokenService.getToken()}`
      }
    });
    console.log("用户信息：", resp.data);
  }, [tokenService]);

  const testRequest = useCallback(async () => {
    getUser();
    getUser();
    getUser();
  }, [getUser]);

  return <>
    <Button onClick={testRequest}>
      请求用户信息
    </Button>
    <Button onClick={() => {
      tokenSaver.clear();
      login();
    }}>登出</Button>
  </>;
};
