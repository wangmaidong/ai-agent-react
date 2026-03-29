import {useAppService} from "../AppService/useAppService";

export const LayoutPages = (props: { children: any }) => {

  const { userInfo, isLoadingUser, logout, wrapContent } = useAppService({
    cache_prefix: 'pages',
    autoInitializeUser: true,
    defaultSetToken: true,
  });

  return wrapContent(
    <div>
      <h1>Page 路由</h1>
      {props.children}
    </div>
  );
};
