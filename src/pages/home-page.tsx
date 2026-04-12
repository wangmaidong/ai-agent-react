import { useCallback } from 'react';
import { Button } from 'antd';
import { useInjectApp } from '../AppService/useAppService';
import { useMounted } from '../uses/useMounted';
import { LibraryLoader } from '../utils/LibraryLoader';

export default () => {
  const { http, logout } = useInjectApp();

  const getUser = useCallback(async () => {
    const resp = await http.get('/users/me', {});
    console.log('用户信息：', resp.data);
  }, [http]);

  const testRequest = useCallback(async () => {
    getUser();
    getUser();
    getUser();
  }, [getUser]);

  useMounted(async () => {
    const Echarts = await LibraryLoader.load('echarts');
    console.log('Echarts', Echarts);
  });

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
