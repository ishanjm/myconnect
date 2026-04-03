import axios from 'axios';
import { IDocument } from '@/model/Document';

const API_BASE = '/api/documents';

export const documentsService = {
  fetchDocuments: async (): Promise<IDocument[]> => {
    const response = await axios.get<{ documents: IDocument[] }>(API_BASE);
    return response.data.documents;
  },

  createDocument: async (formData: FormData): Promise<IDocument> => {
    const response = await axios.post<{ document: IDocument }>(API_BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.document;
  }
};
