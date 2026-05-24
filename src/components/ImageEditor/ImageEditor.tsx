import { Button, Image } from "antd";
import { pathJoin } from "@peryl/utils/pathJoin";
import { PUBLIC_PATH } from "../../AppService/env.ts";
import { useUploadService } from "../../uses/useUploadService.tsx";
import { showError } from "../../utils/showError.ts";
import { chooseImage } from "../../utils/FileService.ts";

export function ImageEditor(props: { value?: string, onChange: (filePath: string) => void }) {
  const { upload } = useUploadService();
  return (
    <Button type="link" onClick={async () => {
      try {
        const file = (await chooseImage(false)) as File;
        const fileRecord = await upload({ file });
        props.onChange(fileRecord.path);
      } catch (e) {
        showError(e);
      }
    }}>
      {!!props.value && <Image src={pathJoin(PUBLIC_PATH, props.value)} style={{ width: "20px", height: "20px" }} />}
      <span>上传</span>
    </Button>
  );
}
