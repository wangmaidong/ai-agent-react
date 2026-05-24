import type { MenuProps } from "antd";
import { router } from "./routes";
import React from "react";
import HomeOutlined from "@ant-design/icons/HomeOutlined";

type MenuItem = Required<MenuProps>["items"][number];

export const menus: MenuItem[] = [
  { key: "/pages/home", icon: <HomeOutlined />, label: "系统首页" },
  { key: "/pages/resume/resume-template-list", icon: <HomeOutlined />, label: "简历模板" },
  { key: "/pages/resume/resume-user-list", icon: <HomeOutlined />, label: "用户简历" },
  { key: "/pages/demo/demo-backup", icon: <HomeOutlined />, label: "通用表格" },
  { key: "/pages/demo/demo-table-create", icon: <HomeOutlined />, label: "通用表格：新建" },
  { key: "/pages/demo/demo-drawer-service", icon: <HomeOutlined />, label: "抽屉服务" },
  { key: "/pages/demo/demo-auto-form", icon: <HomeOutlined />, label: "表单封装" },
  { key: "/pages/demo/demo-form-service", icon: <HomeOutlined />, label: "表单服务" },

  // { key: '/pages/book/hotel-list', icon: <CoffeeOutlined/>, label: '酒店预定', },
  //
  // { key: '/pages/org/org', icon: <ClusterOutlined/>, label: '组织管理', },
  // { key: '/pages/pos/pos', icon: <FormatPainterOutlined/>, label: '职位管理', },
  // { key: '/pages/user/user', icon: <UserSwitchOutlined/>, label: '用户管理', },
  //
  // { key: '/pages/project/project', icon: <FolderOpenOutlined/>, label: '项目管理', },
  // { key: '/pages/reimburse/reimburse-list', icon: <TransactionOutlined/>, label: '报销管理', },
  // { key: '/pages/order/order-list', icon: <PayCircleOutlined/>, label: '订单管理', },
  // { key: '/pages/approve/approve', icon: <IssuesCloseOutlined/>, label: '审批管理', },
  // { key: '/pages/invoice/invoice-list', icon: <SmileOutlined/>, label: '发票管理', },
  // { key: '/pages/assistant/chat', icon: <MoneyCollectOutlined/>, label: '智能管家', },
  // { key: '/pages/module/module-list', icon: <MoneyCollectOutlined/>, label: '模块管理', },
  // { key: '/pages/api-secret/api-secret-list', icon: <MoneyCollectOutlined/>, label: 'API 秘钥', },
  // {
  //   key: 'KnowledgeManage',
  //   icon: <ZhihuOutlined/>,
  //   label: '知识管理',
  //   children: [
  //     { key: '/pages/knowledge/knowledge-list', icon: <ReadOutlined/>, label: '知识库', },
  //     { key: '/pages/knowledge/document-list', icon: <ReadOutlined/>, label: '在线文档', },
  //     { key: '/pages/knowledge/report-list', icon: <ReadOutlined/>, label: '日报周报', },
  //     { key: '/pages/knowledge/qa-bot-list', icon: <ReadOutlined/>, label: '知识问答', },
  //   ]
  // },
];

function handleMenuClick(_menus: MenuItem | MenuItem[]) {
  const menus = Array.isArray(_menus) ? _menus : [_menus];
  menus.forEach((item: any) => {
    if (!!item.children) {
      /*如果有children，就只处理children的菜单点击动作*/
      handleMenuClick(item.children);
    } else {
      /*如果没有children，就处理当前菜单的点击动作*/
      if (!item.onClick) {
        item.onClick = () => {
          // console.log('click menu', item);
          router.navigate(String(item.key));
        };
      }
    }
  });
}

handleMenuClick(menus as any);
