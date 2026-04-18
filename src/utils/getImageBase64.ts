import { defer } from "@peryl/utils/defer";

/**
 * 读取文件为base64字符串
 * @date    2021/1/1 17:04
 */
export const getImageBase64 = (file: File) => {
  const dfd = defer<string>();
  let fr = new FileReader();
  fr.onloadend = e => dfd.resolve(e.target!.result as any);
  fr.onerror = () => dfd.reject();
  fr.readAsDataURL(file);
  return dfd.promise;
};
