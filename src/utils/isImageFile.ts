/**
 * 判断文件是否为图片
 * @param file File 对象或包含 type/name 的类文件对象
 * @returns boolean
 */
export const isImageFile = (file: File | { type: string; name: string }): boolean => {
  // 1. 通过 MIME 类型判断 (最常用)
  // 常见的图片类型有 image/jpeg, image/png, image/gif, image/webp, image/avif 等
  if (file.type && file.type.startsWith("image/")) {
    return true;
  }

  // 2. 兜底方案：通过后缀名判断 (防止某些情况下 type 为空)
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "avif"];
  const fileName = file.name || "";
  const extension = fileName.split(".").pop()?.toLowerCase();

  return !!(extension && imageExtensions.includes(extension));
};
