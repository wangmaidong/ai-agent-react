import { useBeforeUnmount, useMounted } from "../../uses/useMounted";
import { MonacoLoader } from "./monaco.utils";
import { CSSProperties, useRef, useState } from "react";
import { useModelState } from "../../uses/useModelState";
import { createEffects } from "@peryl/utils/createEffects";
import { classnames } from "@peryl/utils/classnames";
import PageSpin from "../PageSpin";
import "./MonacoEditor.scss";

export const MonacoEditor = (props: iMonacoEditorProps) => {

  /*要实例化为monaco 编辑器的dom对象*/
  const targetRef = useRef(null as null | HTMLDivElement);
  /*monaco实例化之后得到的editor对象*/
  const editorRef = useRef(null as null | Record<string, any>);

  const [modelValue, updateModelValue] = useModelState(props.value ?? "", props.onChange, {
    onPropsValueChange: val => {!!editorRef.current && editorRef.current.setValue(val ?? "");},
  });

  const [isReady, setReady] = useState(false);

  const [{ effects }] = useState(() => createEffects());

  useMounted(async () => {
    /*加载monaco静态资源*/
    const monaco = await MonacoLoader.getMonaco();

    setReady(true);

    /*实例化monaco编辑器对象*/
    editorRef.current = monaco.editor.create(targetRef.current, {
      value: modelValue,
      language: props.language,
      lineNumbers: "on",
      roundedSelection: true,
      scrollBeyondLastLine: false,

      theme: props.theme ?? "vs-dark",
      // fontSize: "14px",
      // fontFamily: "unset",
      readOnly: props.readonly,
    });

    const contentListener = editorRef.current!.onDidChangeModelContent(() => {
      updateModelValue(editorRef.current!.getValue());
    });
    effects.push(() => {contentListener.dispose();});

    if (props.onKeydown) {
      const keydownListener = editorRef.current!.onKeyDown(props.onKeydown);
      effects.push(() => {keydownListener.dispose();});
    }

    effects.push(() => {editorRef.current!.dispose();});
  });

  useBeforeUnmount(() => {effects.clear();});

  return (
    <div className={classnames([
      "aic-monaco-editor",
      { "monaco-editor-full-height": props.fullHeight },
    ])} style={props.style}>
      {!isReady && (
        <PageSpin />
      )}
      <div ref={targetRef} className="monaco-editor-target" />
    </div>
  );
};

export interface iMonacoEditorProps {
  value?: string,
  language: "javascript" | "css" | "html" | "json" | "typescript",
  theme?: "vs" | "vs-dark" | "hc-black",
  fullHeight?: boolean,
  readonly?: boolean,

  onChange?: (value: string) => void,
  onKeydown?: (e: any) => void,

  style?: CSSProperties
}