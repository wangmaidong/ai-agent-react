import { iUploadExternalData, useUploadService } from "./useUploadService";
import { useStableCallback } from "./useStableCallback";
import { compressCanvas } from "../utils/compressCanvas";
import { base64toFile } from "../utils/base64ToFile";
import html2canvas from "html2canvas";

export function useSnapshot() {
  const { upload, ...appService } = useUploadService();

  const getSnapshot = useStableCallback(async (
    { el, compress, uploadExternalData }: {
      el: HTMLElement,
      compress?: boolean,
      uploadExternalData?: iUploadExternalData
    },
  ) => {
    compress = compress ?? true;
    const canvas = await html2canvas(el, { useCORS: true });
    const base64 = compress ? compressCanvas(canvas, 1920, 1080) : canvas.toDataURL("image/jpeg", 1);
    const file = base64toFile(base64);
    const fileRecord = await upload({
      file,
      data: uploadExternalData ?? { headId: "unknown" },
    });
    return fileRecord?.path;
  });

  return { getSnapshot, upload, ...appService };
}
