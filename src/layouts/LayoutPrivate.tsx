import {useAppService} from "../AppService/useAppService";

export const LayoutPrivate = (props: { children: any }) => {

  const { isLoadingUser, wrapContent } = useAppService({
    cache_prefix: 'private',
    autoInitializeUser: true,
    defaultSetToken: true,
  });

  return wrapContent(
    <div>
      <h1>Private 路由</h1>
      {props.children}
    </div>
  );
};
