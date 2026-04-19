import { produce } from "immer";
import { useRef, useState } from "react";
import { doNothing } from "@peryl/utils/doNothing";
import { useStableCallback } from "../../../uses/useStableCallback";

/**
 * useBufferStringHandler 钩子函数
 * * 功能：专门用于处理 AI 流式输出的字符串。
 * 原理：通过维护一个内部缓冲区 (Buffer)，识别特定的标记位（DataStart/DataEnd），
 * 并将中间的增量内容实时解析为结构化对象路径并更新状态。
 */
export function useBufferStringHandler<T>(
  { setState, onBeginProcess, onFinishProcess }: {
    setState: (dispatch: ((prevState: T) => T)) => void,
    onBeginProcess?: () => void, // 进入数据解析区时的回调
    onFinishProcess?: () => void, // 结束数据解析区时的回调
  },
) {

  // 2. 状态管理：isDataRegion 用于控制 UI 层的反馈（比如显示/隐藏正在修改的提示或蒙层）
  const [isDataRegion, setIsDataRegion] = useState(false);

  // 3. 引用容器：stateRef 用于存储“流”处理过程中的中间数据
  // 为什么用 useRef？因为流式回调触发非常频繁，使用 Ref 可以避开闭包陷阱，且更新 Ref 不会触发重绘，性能更高。
  const stateRef = useRef({
    buffer: "",         // 存储尚未被解析的残余字符串
    isDataRegion: false, // 逻辑上的开关：标记当前流是否已经进入了“可解析数据区”
  });

  /**
   * 初始化/重置：在流开始前调用
   */
  const onBegin = useStableCallback(() => {
    stateRef.current = { buffer: "", isDataRegion: false };
    setIsDataRegion(false);
  });

  /**
   * 核心解析逻辑：将形如 "basicInfo.name=张三" 的多行字符串解析并写入 Immer Draft
   */
  const processLines = useStableCallback((linesStr: string) => {
    const lines = linesStr.split("\n");
    setState(
      produce((draft) => {
        lines.forEach((line) => {
          const trimmed = line.trim();
          // 跳过空行或 Markdown 代码块标识符
          if (!trimmed || trimmed.startsWith("```")) return;

          // 使用正则拆分：key=value -> [全量, key, value]
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const [, pathStr, value] = match;
            // 解析路径（如 "exp.0.title"）并执行深度设置
            setValueByPath(draft, parsePath(pathStr.trim()), value.trim());
          }
        });
      }),
    );
  });

  /**
   * 接收流数据：这是核心入口，处理每一块传来的数据
   */
  const onChunk = useStableCallback((chunkMessage: string) => {
    // A. 累加新到达的文本块
    stateRef.current.buffer += chunkMessage;
    const ref = stateRef.current;

    // B. 进入数据区检测：寻找 /*---DataStart---*/
    if (!ref.isDataRegion) {
      const startIndex = ref.buffer.indexOf("/*---DataStart---*/");
      if (startIndex !== -1) {
        ref.isDataRegion = true;
        setIsDataRegion(true); // 通知 UI：进入数据区
        onBeginProcess?.();    // 触发外部回调
        // 截断缓冲区：只保留 DataStart 之后的内容
        ref.buffer = ref.buffer.substring(startIndex + "/*---DataStart---*/".length);
      } else {
        // 还没到数据区，保持 doNothing (可扩展：防止 buffer 溢出的清理逻辑)
        doNothing();
      }
    }

    // C. 实时解析逻辑：只有在数据区内才进行解析
    if (ref.isDataRegion) {
      const endIndex = ref.buffer.indexOf("/*---DataEnd---*/");

      // C1. 如果发现了结束标识
      if (endIndex !== -1) {
        const finalContent = ref.buffer.substring(0, endIndex);
        processLines(finalContent); // 处理最后一段内容

        ref.isDataRegion = false;
        setIsDataRegion(false); // 恢复 UI
        onFinishProcess?.();    // 触发结束回调
        ref.buffer = "";        // 清空缓冲区
        return;
      }

      // C2. 行级处理：处理当前 buffer 中所有完整的行 (\n)
      // 为什么？因为最后一行可能还没接收完整（例如 "name=张"），必须等下一块数据。
      const lastLineIndex = ref.buffer.lastIndexOf("\n");
      if (lastLineIndex !== -1) {
        const completeLines = ref.buffer.substring(0, lastLineIndex);
        // 将不完整的末尾行保留在 buffer 中，待下次 onChunk 拼接
        ref.buffer = ref.buffer.substring(lastLineIndex + 1);
        processLines(completeLines);
      }
    }
  });

  /**
   * 流结束：处理收尾工作
   */
  const onFinish = useStableCallback(() => {
    // 补齐：如果流结束时没有以换行符结尾，强制处理 buffer 剩下的内容
    if (stateRef.current.isDataRegion && stateRef.current.buffer.trim()) {
      processLines(stateRef.current.buffer);
    }
    stateRef.current.buffer = "";
    setIsDataRegion(false);
  });

  return { onBegin, onFinish, onChunk, isDataRegion };
}

// --- 工具函数详解 ---

/**
 * 路径解析器
 * 例如: "education.1.school" -> ["education", 1, "school"]
 * 注意：它会自动将字符串数字转为真正的 Number 类型，方便后续作为数组下标使用
 */
const parsePath = (pathStr: string) => {
  return pathStr.split(".").map(key => (isNaN(Number(key)) ? key : Number(key)));
};

/**
 * 深度设值函数（核心原理解析）
 * @param draft Immer 提供的响应式草稿
 * @param path 解析后的路径数组
 * @param value 要设置的值
 */
const setValueByPath = (draft: any, path: (string | number)[], value: any) => {
  if ([";", "；", ".", "。"].indexOf(value[value.length - 1]) > -1) {
    value = value.slice(0, -1);
  }
  let current = draft;
  // 遍历路径，直到倒数第二层
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    // 自动初始化：如果路径断了，根据下一位的类型创建 {} 或 []
    if (!current[key]) {
      current[key] = typeof path[i + 1] === "number" ? [] : {};
    }
    current = current[key];
  }
  // 在最后一层设置具体的值
  current[path[path.length - 1]] = value;
};
