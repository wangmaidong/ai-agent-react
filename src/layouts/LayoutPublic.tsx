import {useAppService} from "../AppService/useAppService";
import React from "react";

export const LayoutPublic = (props: React.PropsWithChildren<{}>) => {

  const { wrapContent } = useAppService({
    cache_prefix: 'public',
    autoInitializeUser: false,
    defaultSetToken: false,
  });

  return wrapContent(
    <div className="app-home" data-collapse={String(true)}>
      <div className="app-home-body" style={{ marginLeft: 0, width: '100%' }}>
        {props.children}
      </div>
    </div>
  );
};
