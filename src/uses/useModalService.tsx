import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useRootRenderContext } from "./useRootRender";
import { uuid } from "@peryl/utils/uuid";
import { showError } from "../utils/showError";
import { delay } from "@peryl/utils/delay";
import { Button, Modal, type ModalProps, Space } from "antd";
import { useBeforeUnmount, useMounted } from "./useMounted";
import { LoadingCover } from "../components/LoadingCover/LoadingCover";
import { createEffects } from "@peryl/utils/createEffects";

export interface iModalServiceConfig {
  content: React.ReactNode,
  handleConfirm: () => boolean | void | Promise<boolean | void>,
  handleCancel?: () => void | Promise<void>,
  onInit?: () => void,
  modalClassName?: string,
  modalWidth?: number,
  footerLeft?: React.ReactNode,
  modalProps?: ModalProps,
}

type iContentProps = {}
type iContentInstance = { triggerConfirm: () => void, close: () => void };

/*
* 命令式使用Modal弹窗服务
*/
export function useModalService() {
  const { setRootRenderList } = useRootRenderContext();
  const [{ effects: componentEffects }] = useState(() => createEffects());
  useBeforeUnmount(() => {componentEffects.clear();});

  const openModal = useCallback((config: iModalServiceConfig) => {

    const renderKey = uuid();

    let contentRef = null as null | iContentInstance;

    const Content = React.forwardRef<iContentInstance, iContentProps>((props, ref) => {

      const [saving, setSaving] = useState(false);
      const [isModalOpen, setModalOpen] = useState(false);

      const isDoneRef = useRef(false)

      const onConfirm = async () => {
        try {
          setSaving(true);
          const flag = await config.handleConfirm();
          if (flag === false) {return;}
          setModalOpen(false);
          isDoneRef.current = true;
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
        <Modal
          wrapClassName={config.modalClassName}
          width={config.modalWidth ?? "fit-content"}
          open={isModalOpen}
          onCancel={onCancel}
          afterOpenChange={open => {
            setModalOpen(open);
            !open && onClose();
          }}
          footer={config.modalProps?.footer ?? <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1em" }}>
              <div>{config.footerLeft}</div>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={onCancel} disabled={saving}>取消</Button>
                <Button type="primary" onClick={onConfirm} loading={saving}>确定</Button>
              </Space>
            </div>
          </>}
          afterClose={() => setModalOpen(false)}
          {...config.modalProps}
        >
          {config.content}
          {saving && <LoadingCover />}
        </Modal>
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

  return { openModal };
}

export type iModalService = ReturnType<typeof useModalService>
