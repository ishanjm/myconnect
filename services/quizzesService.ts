import axios from "axios";
import { QuizQuestion } from "@/model/Quiz";

export interface QuizItem {
  id: number;
  title: string;
  questions: QuizQuestion[];
  userId: number;
  accessKey: string;
  shuffleQuestions?: boolean;
  shuffleAnswers?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuizInput {
  title: string;
  questions: QuizQuestion[];
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
}

const API_BASE = "/api/quizzes";

export const quizzesService = {
  fetchQuizzes: async (): Promise<QuizItem[]> => {
    const response = await axios.get<{ quizzes: QuizItem[] }>(API_BASE);
    return response.data.quizzes;
  },
  
  fetchQuizById: async (id: number): Promise<QuizItem> => {
    const response = await axios.get<{ quiz: QuizItem }>(`${API_BASE}/${id}`);
    return response.data.quiz;
  },

  createQuizzes: async (quizzes: CreateQuizInput[]): Promise<QuizItem[]> => {
    const response = await axios.post<{ quizzes: QuizItem[] }>(API_BASE, {
      quizzes,
    });
    return response.data.quizzes;
  },

  updateQuiz: async (
    id: number,
    payload: CreateQuizInput,
  ): Promise<QuizItem> => {
    const response = await axios.put<{ quiz: QuizItem }>(`${API_BASE}/${id}`, payload);
    return response.data.quiz;
  },

  deleteQuiz: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/${id}`);
  },
};
