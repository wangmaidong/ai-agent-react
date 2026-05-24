import { useRootRenderContext } from "./useRootRender.tsx";
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button, Drawer, Space } from "antd";
import { uuid } from "@peryl/utils/uuid.ts";
import { showError } from "../utils/showError.ts";
import { useBeforeUnmount, useMounted } from "./useMounted.tsx";
import { delay } from "@peryl/utils/delay.ts";
import { LoadingCover } from "../components/LoadingCover/LoadingCover.tsx";
import type { DrawerProps } from "antd/lib";
import { createEffects } from "@peryl/utils/createEffects.ts";

export interface iDrawerServiceConfig {
  content: React.ReactNode,
  handleConfirm: () => boolean | void | Promise<boolean | void>,
  handleCancel?: () => void | Promise<void>,
  onInit?: () => void,
  drawerClassName?: string,
  drawerWidth?: number,
  footerLeft?: React.ReactNode,
  drawerProps?: DrawerProps,
}

type iContentProps = {}
type iContentInstance = { triggerConfirm: () => void, close: () => void };

export function useDrawerService() {

  const { setRootRenderList } = useRootRenderContext();
  const [{ effects: componentEffects }] = useState(() => createEffects());
  useBeforeUnmount(() => {componentEffects.clear();});

  const openDrawer = useCallback((config: iDrawerServiceConfig) => {

    const renderKey = uuid();

    let contentRef = null as null | iContentInstance;

    const Content = React.forwardRef<iContentInstance, iContentProps>((props, ref) => {

      const [saving, setSaving] = useState(false);
      const [isModalOpen, setModalOpen] = useState(false);

      const isDoneRef = useRef(false);

      const onConfirm = async () => {
        try {
          setSaving(true);
          const flag = await config.handleConfirm();
          if (flag === false) {return;}
          isDoneRef.current = true;
          setModalOpen(false);
        } catch (e) {
          showError(e);
        } finally {
          setSaving(false);
        }
      };

      const onCancel = () => {
        if (isDoneRef.current) {return;}
        isDoneRef.current = true;
        config.handleCancel?.();
        setModalOpen(false);
      };

      const onClose = () => {
        onCancel();
        clearEffect();
      };

      useMounted(async () => {
        setModalOpen(true);
        /*等内容初始化*/
        await delay(78);
        config.onInit?.();
      });

      useImperativeHandle(ref, () => ({ triggerConfirm: onConfirm, close: () => setModalOpen(false) }));

      useEffect(() => {
        const close = () => setModalOpen(false);
        componentEffects.push(close);
        return () => {
          const index = componentEffects.list.indexOf(close);
          if (index >= 0) {componentEffects.list.splice(index, 1);}
        };
      }, []);

      return (
        <Drawer
          className={config.drawerClassName}
          size={config.drawerWidth ?? "fit-content"}
          open={isModalOpen}
          // onCancel={onCancel}
          afterOpenChange={open => {
            setModalOpen(open);
            !open && onClose();
          }}
          footer={config.drawerProps?.footer ?? <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>{config.footerLeft}</div>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={onCancel} disabled={saving}>取消</Button>
                <Button type="primary" onClick={onConfirm} loading={saving}>确定</Button>
              </Space>
            </div>
          </>}
          onClose={() => setModalOpen(false)}
          {...config.drawerProps}
        >
          {config.content}
          {saving && <LoadingCover />}
        </Drawer>
      );
    });

    setRootRenderList(prevList => ([...prevList, { key: renderKey, render: <Content ref={(refer: any) => contentRef = refer} /> }]));

    const clearEffect = () => {
      setRootRenderList(prevList => prevList.filter(i => i.key !== renderKey));
      contentRef = null;
    };

    return {
      closeModal: () => contentRef?.close(),
      triggerConfirm: () => contentRef?.triggerConfirm(),
    };

  }, [setRootRenderList, componentEffects]);

  return { openDrawer };
}
