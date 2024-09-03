interface JournalEntry {
  id: string;
  type?: "text" | "image";
  content: (string | { uri: string; caption?: string })[];
  title: string;
  category: string;
  created_at: string;
  content_text?: string;
  content_image?: { uri: string; name: string } | null;
}
