export interface IDocument {
  id: string;
  title: string;
  description: string;
  categoryId: number; // Linked to IDocumentCategory
  fileType: "pdf" | "docx" | "xlsx" | "pptx";
  fileSize: string;
  updatedAt: string;
  downloadUrl: string;
  locationIds?: number[]; // Added to support mapping
}

export type DocumentFileType = IDocument["fileType"];
