import { StackNavigationProp } from "@react-navigation/native";

export interface JournalEntry {
  id: string;
  type?: "text" | "image";
  content: (string | { uri: string; caption?: string })[];
  title: string;
  entryId: string | number | null;
  category: string;
  created_at: string;
  content_text?: string;
  content_image?: { uri: string; name: string } | null;
}

export interface MenuProps {
  navigation: StackNavigationProp<RootStackParamList>;
  onDeleteAccount: () => void;
}

export interface JournalEntryMenuProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface HomeMenuProps {
  visible: boolean;
  onClose: () => void;
  onNewEntry: () => void;
}

export interface ConfirmDeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface DeleteConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface LogoutConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
}

export interface CustomTextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
}

export interface FallbackComponentProps {
  error: Error;
  resetError: () => void;
}

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;
  Profile: undefined;
  Summary: undefined;
  JournalEntry: undefined;
  Fallback: undefined;
  NotFound: undefined;
};

export type NavigationProp<
  T extends keyof RootStackParamList = keyof RootStackParamList,
> = StackNavigationProp<RootStackParamList, T>;
