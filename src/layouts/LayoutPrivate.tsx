import React from "react";
import {useAppService} from "../AppService/useAppService";
import PageSpin from "../components/PageSpin";

export const LayoutPrivate = (props: React.PropsWithChildren) => {

  const { isLoadingUser, wrapContent } = useAppService({
    cache_prefix: 'private',
    autoInitializeUser: true,
    defaultSetToken: true,
  });

  return wrapContent(
    <div className="app-home" data-collapse={String(true)}>
      <div className="app-home-body" style={{ marginLeft: 0, width: '100%' }}>
        {isLoadingUser ? <PageSpin/> : props.children}
      </div>
    </div>
  );
};
