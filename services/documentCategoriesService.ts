import axios from 'axios';
import { IDocumentCategory, CreateDocumentCategoryPayload } from '@/model/DocumentCategory';

const API_BASE = '/api/document-categories';

export const documentCategoriesService = {
  fetchCategories: async (): Promise<IDocumentCategory[]> => {
    const response = await axios.get<{ categories: IDocumentCategory[] }>(API_BASE);
    return response.data.categories;
  },

  createCategory: async (payload: CreateDocumentCategoryPayload): Promise<IDocumentCategory> => {
    const response = await axios.post<{ category: IDocumentCategory }>(API_BASE, payload);
    return response.data.category;
  },

  updateCategory: async (id: number, payload: Partial<CreateDocumentCategoryPayload>): Promise<IDocumentCategory> => {
    const response = await axios.put<{ category: IDocumentCategory }>(`${API_BASE}/${id}`, payload);
    return response.data.category;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/${id}`);
  }
};
