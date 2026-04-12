import {useCallback} from "react";
import {Button} from "antd";
import {useInjectApp} from "../AppService/useAppService";

export default () => {

  const { http, logout } = useInjectApp();

  const getUser = useCallback(async () => {
    const resp = await http.get('/users/me', {});
    console.log("用户信息：", resp.data);
  }, [http]);

  const testRequest = useCallback(async () => {
    getUser();
    getUser();
    getUser();
  }, [getUser]);

  return (
    <>
      <Button onClick={testRequest}>
        请求用户信息
        <i className="bootstrap-icons" />
      </Button>
      <Button onClick={logout}>登出</Button>
    </>
  );
};
