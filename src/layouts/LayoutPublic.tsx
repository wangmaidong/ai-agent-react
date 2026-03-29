import {useAppService} from "../AppService/useAppService";

export const LayoutPublic = (props: { children: any }) => {

  const { wrapContent } = useAppService({
    cache_prefix: 'public',
    autoInitializeUser: false,
    defaultSetToken: false,
  });


  return wrapContent(
    <div>
      {props.children}
    </div>
  );
};
