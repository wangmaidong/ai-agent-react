// interface AxiosDefaultConfig {
//   baseURL: string, // 基础的请求路径前缀
//   timeout: number, // 请求过期时间
//   setToken?: boolean,
// }
//
// interface AxiosInputConfig {
//   url: string,
//   methods: "get" | "post"
// }
//
// type AxiosRequestConfig = AxiosInputConfig & Partial<AxiosDefaultConfig>
//
// type AxiosRunningConfig = AxiosInputConfig & AxiosDefaultConfig;
//
// /*
// * defaultConfig： 创建服务实例的时候的默认参数      AxiosDefaultConfig
// * requestConfig： 调用服务函数的时候的参数         AxiosRequestConfig
// * runningConfig： 服务运行期间，参数的类型         AxiosRunningConfig
// *
// */
// function createAxios(defaultConfig: AxiosDefaultConfig) {
//   return {
//     request: (requestConfig: AxiosRequestConfig) => {
//
//       const runningConfig: AxiosRunningConfig = {
//         ...defaultConfig,
//         ...requestConfig,
//       };
//
//       return runningConfig;
//     },
//   };
// }
//
// const http = createAxios({
//   baseURL: "http://localhost:7005",
//   timeout: 1000 * 60,
// });
//
// console.log(
//   http.request({
//     url: "/general/project/list",
//     methods: "post",
//   }),
// );

export default {};
