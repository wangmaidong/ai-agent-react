import qs from 'qs';
import { router } from '../layouts/routes';

export function getLocationInfo() {
  return {
    path: '/' + window.location.pathname.replace(new RegExp(`^/?${__webpack_public_path__}/?`), ''),
    param: qs.parse(
      window.location.search.startsWith('?')
        ? window.location.search.slice(1)
        : window.location.search
    ),
  };
}

export const login = () => {
  const { path, param } = getLocationInfo();
  console.log('login', { path, param });
  delete param.token;
  const searchString = qs.stringify({
    ...param,
    path,
    layout: path.split('/').filter((i) => !!i.trim().length)[0],
  });
  router.navigate(`/public/login?${searchString}`);
};
