import Axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import {pathJoin} from "@peryl/utils/pathJoin";
import {delay} from "@peryl/utils/delay";
import env from "../AppService/env";

const mock = new AxiosMockAdapter(Axios);

/*模拟登录接口*/
export function enableMockJs() {

  /*mock 登录接口*/
  mock.onPost(pathJoin(env.baseURL, '/login')).reply(async (req) => {

    /*随机延迟*/
    await delay(Math.random() * 500 + 500);

    /*验证用户名密码*/
    const username = (req.data as FormData).get('username');
    const password = (req.data as FormData).get('password');
    if (username !== 'zhangsan') {
      return Promise.reject({ message: `用户 ${username} 不存在` });
    }
    if (password !== '123456') {
      return Promise.reject({ message: `密码错误` });
    }

    return [200, LoginResponseData];
  });

  /*mock 刷新接口*/
  mock.onPost(pathJoin(env.baseURL, '/refresh')).reply(async () => {
    return [200, RefreshResponseData];
  });

  /*mock 获取用户信息接口*/
  mock.onGet(pathJoin(env.baseURL, '/users/me')).reply(async () => {
    return [200, UserInfoResponseData];
  });

}

const LoginResponseData = {
  "result": {
    "id": "c42c051f-7f27-11f0-bb5a-0242ac120002",
    "created_at": "2025-08-22 15:15:21",
    "updated_at": "2026-03-22 09:43:02",
    "created_by": null,
    "updated_by": "c42c051f-7f27-11f0-bb5a-0242ac120002",
    "username": "zhangsan",
    "email": "zhangsan@qq.com",
    "full_name": "张三",
    "valid": "Y"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InpoYW5nc2FuIiwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTc3NDQ2NDMyMn0.G9hZ9KONmSF9lzLNQUyoZh_iXM37Qg5EeCgs0YYJ1M0",
  "access_expires": 1800000, // 1800000 / 1000 / 60 = 30 分钟（token有效时间）
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InpoYW5nc2FuIiwidHlwZSI6InJlZnJlc2giLCJleHAiOjE4MTA3NTA1MjJ9.qfyE380CIMFTIt8zQrrUcF1dCBhJ-06PnhXDybkhCjU",
  "refresh_expires": 604800000 // 604800000 / 1000 / 60 / 60 / 24 = 7 天（refreshToken有效时间）
};

const RefreshResponseData = {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InpoYW5nc2FuIiwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTc3NDQ2NDMyMn0.G9hZ9KONmSF9lzLNQUyoZh_iXM37Qg5EeCgs0YYJ1M0",
  "access_expires": 1800000, // 1800000 / 1000 / 60 = 30 分钟（token有效时间）
};

const UserInfoResponseData = {
  "id": "c42c051f-7f27-11f0-bb5a-0242ac120002",
  "created_at": "2025-08-22 15:15:21",
  "updated_at": "2025-09-29 13:24:53",
  "updated_by": "c42c051f-7f27-11f0-bb5a-0242ac120002",
  "username": "zhangsan",
  "email": "zhangsan@qq.com",
  "full_name": "张三",
  "valid": "Y",
  "pos_code": "POS017",
  "created_by": null,
  "pos": {
    "id": "d5bf9b8b-7fc3-11f0-bb5a-0242ac120002",
    "created_at": "2025-08-22 18:59:56",
    "updated_at": "2025-08-22 18:59:56",
    "created_by": "admin",
    "updated_by": "admin",
    "name": "前端工程师",
    "code": "POS017",
    "remarks": "负责前端开发工作",
    "pos_level": 3,
    "parent_code": "POS013",
    "organization_code": "ORG004",
    "parent_name": null,
    "org_name": null
  },
  "pos_name": "前端工程师",
  "org_name": null
};
