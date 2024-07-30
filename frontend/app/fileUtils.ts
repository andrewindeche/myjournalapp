export const getFileExtension = (url: string): string => {
  const matches = url.match(/\.(jpg|jpeg|png|gif|bmp)$/i);
  return matches ? matches[1] : "jpg";
};
