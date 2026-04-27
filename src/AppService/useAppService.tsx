import React, { useCallback, useContext, useState } from "react";
import { createTokenSaver } from "./createTokenSaver";
import { createTokenService } from "./createTokenService";
import { createHttp } from "./createHttp";
import { useMounted } from "../uses/useMounted";
import { showError } from "../utils/showError";
import { iUserRecord } from "../utils/type.utils";
import { login } from "./login";
import { useRootRenderService } from "../uses/useRootRender";

export function useAppService(
  {
    cache_prefix,
    autoInitializeUser,
    defaultSetToken,
  }: {
    cache_prefix: string;         // token缓存前缀
    autoInitializeUser: boolean;  // 是否自动初始化用户信息
    defaultSetToken: boolean,     // 是否默认设置请求头中的token
  }) {

  const { wrap: rootRenderWrap } = useRootRenderService();

  const [tokenSaver] = useState(() => createTokenSaver(cache_prefix));
  const [tokenService] = useState(() => createTokenService(tokenSaver));
  const [http] = useState(() => createHttp(tokenService, defaultSetToken));

  const [userInfo, setUserInfo] = useState(null as null | iUserRecord);
  const [isLoadingUser, setIsLoadingUser] = useState(autoInitializeUser);

  const reloadUserInfo = useCallback(async () => {
    try {
      setIsLoadingUser(true);
      const resp = await http.get<iUserRecord>("/users/me");
      setUserInfo(resp.data);
    } catch (e) {
      showError(e);
    } finally {
      setIsLoadingUser(false);
    }
  }, [http]);

  const logout = useCallback(async () => {
    tokenSaver.clear();
    login();
  }, [tokenSaver]);

  useMounted(async () => {
    if (!autoInitializeUser) {return;}
    await reloadUserInfo();
  });

  const refer = {
    http,
    userInfo,
    setUserInfo,
    isLoadingUser,
    setIsLoadingUser,
    tokenService,
    reloadUserInfo,
    logout,
  };

  const wrapContent = (content: any) => {
    return (
      <AppServiceContext.Provider value={refer as any}>
        {rootRenderWrap(content)}
      </AppServiceContext.Provider>
    );
  };

  return { ...refer, wrapContent };
}

export type iAppService = ReturnType<typeof useAppService>;

const AppServiceContext = React.createContext<iAppService>(null as any);

export function useAppContext() {return useContext(AppServiceContext)!;}
