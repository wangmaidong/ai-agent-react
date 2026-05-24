export function extractContentFromTags(
  message: string,
  startTag: string,
  endTag: string,
) {
  if (message.indexOf(endTag) > -1) {
    const startIndex = message.indexOf(startTag);
    const endIndex = message.indexOf(endTag);
    return message.slice(startIndex + startTag.length, endIndex);
  } else {
    return null;
  }
}
