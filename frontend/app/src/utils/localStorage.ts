import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const MEDIA_DIRECTORY = FileSystem.documentDirectory + 'journal_media/';

export const ensureMediaDirectory = async (): Promise<void> => {
  const dirInfo = await FileSystem.getInfoAsync(MEDIA_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(MEDIA_DIRECTORY, { intermediates: true });
  }
};

export const saveImageLocally = async (uri: string, filename: string): Promise<string> => {
  await ensureMediaDirectory();
  const newPath = MEDIA_DIRECTORY + filename;
  await FileSystem.copyAsync({ from: uri, to: newPath });
  return newPath;
};

export const saveVideoLocally = async (uri: string, filename: string): Promise<string> => {
  await ensureMediaDirectory();
  const newPath = MEDIA_DIRECTORY + filename;
  await FileSystem.copyAsync({ from: uri, to: newPath });
  return newPath;
};

export const deleteLocalMedia = async (uri: string): Promise<void> => {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(uri);
  }
};

export const getLocalMediaPath = (filename: string): string => {
  return MEDIA_DIRECTORY + filename;
};

export const requestMediaPermissions = async (): Promise<boolean> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
};
