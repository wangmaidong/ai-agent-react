export function createTokenSaver(_cache_prefix: string) {
  const cache_prefix = _cache_prefix + "_";
  let access_token = localStorage.getItem(cache_prefix + "access_token");
  let access_expire_timestamp = Number(localStorage.getItem(cache_prefix + "access_expire_timestamp") ?? 0);
  let refresh_token = localStorage.getItem(cache_prefix + 'refresh_token');
  let refresh_expire_timestamp = Number(localStorage.getItem(cache_prefix + 'refresh_expire_timestamp') ?? 0);

  return {
    get: () => {
      if (!access_token || !refresh_token) {
        return null;
      }
      return {
        cache_prefix,
        access_token,
        refresh_token,
        isAccessExpired: () => Date.now() > access_expire_timestamp,
        isRefreshExpired: () => Date.now() > refresh_expire_timestamp,
      };
    },
    saveAccessToken: (_access_token: string, _access_expires: number) => {
      access_token = _access_token;
      localStorage.setItem(cache_prefix + "access_token", _access_token);
      access_expire_timestamp = Date.now() + _access_expires;
      localStorage.setItem(cache_prefix + "access_expire_timestamp", String(access_expire_timestamp));
    },
    saveRefreshToken: (_refresh_token: string, _refresh_expires: number) => {
      refresh_token = _refresh_token;
      localStorage.setItem(cache_prefix + 'refresh_token', _refresh_token);
      refresh_expire_timestamp = Date.now() + _refresh_expires;
      localStorage.setItem(cache_prefix + 'refresh_expire_timestamp', String(refresh_expire_timestamp));
    },
    clear: () => {
      access_token = '';
      localStorage.removeItem(cache_prefix + "access_token");
      access_expire_timestamp = 0;
      localStorage.removeItem(cache_prefix + "access_expire_timestamp");

      refresh_token = '';
      localStorage.removeItem(cache_prefix + 'refresh_token');
      refresh_expire_timestamp = 0;
      localStorage.removeItem(cache_prefix + 'refresh_expire_timestamp');
    },
  };
}

export type iTokenSaver = ReturnType<typeof createTokenSaver>;
