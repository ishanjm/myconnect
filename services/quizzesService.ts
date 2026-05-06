import axios from "axios";
import { QuizAttributes, CreateQuizPayload, QuizQuestion } from "@/model/Quiz";
import { QuizAttemptAnswer, QuizAttemptAttributes } from "@/model/QuizAttempt";

/** Client-side alias for QuizAttributes */
export type QuizItem = QuizAttributes;

/** Client-side alias for CreateQuizPayload */
export type CreateQuizInput = CreateQuizPayload;

/** Client-side alias for QuizAttemptAttributes (without server-only fields) */
export type QuizAttemptItem = Omit<QuizAttemptAttributes, 'updatedAt'> & { createdAt?: string };

/** Payload for saving a quiz attempt */
export type SaveQuizAttemptInput = Omit<QuizAttemptAttributes, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

/** Re-export for consumer convenience */
export type { QuizAttemptAnswer, QuizQuestion };

export interface QuizStatsStudent {
  rank: number;
  userId: number;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  passed: boolean;
  attemptDate?: Date | string;
}

export interface QuizStats {
  quizId: number;
  quizTitle: string;
  totalAttempts: number;
  passCount: number;
  failCount: number;
  passRate: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  rankedStudents: QuizStatsStudent[];
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

  joinQuiz: async (code: string): Promise<QuizItem> => {
    const response = await axios.get<{ quiz: QuizItem }>(`${API_BASE}/join?code=${code}`);
    return response.data.quiz;
  },

  saveAttempt: async (attempt: SaveQuizAttemptInput): Promise<QuizAttemptItem> => {
    const response = await axios.post<{ attempt: QuizAttemptItem }>("/api/quiz-attempts", attempt);
    return response.data.attempt;
  },

  fetchAttempts: async (): Promise<QuizAttemptItem[]> => {
    const response = await axios.get<{ attempts: QuizAttemptItem[] }>("/api/quiz-attempts");
    return response.data.attempts;
  },

  fetchQuizStats: async (quizId: number): Promise<QuizStats> => {
    const response = await axios.get<QuizStats>(`${API_BASE}/${quizId}/stats`);
    return response.data;
  },
};
