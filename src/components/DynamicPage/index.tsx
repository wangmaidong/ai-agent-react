import {useParams} from 'react-router';
import {useMounted} from '../../uses/useMounted';
import React, {useState} from 'react';
import {Alert, Spin} from 'antd';
import {getErrorMessage} from '../../utils/showError';

export const DynamicPage = (props: { dirname: string }) => {
  const params = useParams();

  const [PageComponent, setPageComponent] = useState(null as null | any);

  const [errorMsg, setErrorMsg] = useState(null as null | string);

  console.log(params);

  const routeName: string = [params.name, params['*']].filter((i) => !!i?.trim().length).join('/');

  console.log('routeName', routeName);

  useMounted(async () => {
    try {
      const FileModule = await import('../../' + props.dirname + '/' + routeName + '-page');
      setPageComponent(() => FileModule.default);
    } catch (e) {
      setErrorMsg(getErrorMessage(e));
    }
  });

  return <div>
    {!!errorMsg ?
      <Alert description={errorMsg} type="error"/> :
      !!PageComponent ?
        <PageComponent/> :
        <Spin/>
    }</div>;
};
