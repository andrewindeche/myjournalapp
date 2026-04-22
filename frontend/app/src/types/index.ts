import { StackNavigationProp } from "@react-navigation/native";

export type EntryTheme = "default" | "ocean" | "sunset" | "forest" | "lavender" | "mint" | "rose" | "midnight";

export interface JournalEntry {
  id: number;
  type?: "text" | "image" | "video";
  content: Array<{ type: "text" | "image"; value: string }>;
  title: string;
  entryId?: string | number | null;
  category: string;
  created_at: string;
  content_text?: string;
  content_image?: { uri: string; name: string } | string | null;
  content_video?: { uri: string; name: string } | null;
  theme?: EntryTheme;
  backgroundColor?: string;
  textColor?: string;
}

export interface Category {
  id: number;
  name: string;
  entries?: JournalEntry[];
}

export const ENTRY_THEMES: Record<EntryTheme, { background: string; text: string }> = {
  default: { background: "#ffffff", text: "#000000" },
  ocean: { background: "#e0f7fa", text: "#006064" },
  sunset: { background: "#fff3e0", text: "#e65100" },
  forest: { background: "#e8f5e9", text: "#1b5e20" },
  lavender: { background: "#f3e5f5", text: "#4a148c" },
  mint: { background: "#e0f2f1", text: "#004d40" },
  rose: { background: "#fce4ec", text: "#880e4f" },
  midnight: { background: "#1a237e", text: "#ffffff" },
};

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
