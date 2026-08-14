import { PageContainer } from "../../components/PageContainer/PageContainer.tsx";
import { Button, Card, message } from "antd";
import { useDrawerService } from "../../uses/useDrawerService.tsx";
import { useCallback } from "react";
import { delay } from "@peryl/utils/delay";

export default function Page() {

  const { openDrawer } = useDrawerService();

  const openPageDrawer = useCallback(() => {
    openDrawer({
      drawerProps: {
        title: "抽屉服务",
      },
      drawerWidth: 375,
      content: (
        <div>
          自定义内容
        </div>
      ),
      handleConfirm: async () => {
        /*模拟异步延迟*/
        await delay(1000);
        const val = Math.random() > 0.5;
        if (val) {
          message.success("成功");
        } else {
          message.error("失败");
        }
        return val;
      },
    });
  }, [openDrawer]);

  return (
    <PageContainer>
      <Card>
        <Button type="primary" onClick={openPageDrawer}>打开抽屉服务</Button>
      </Card>
    </PageContainer>
  );
}
