import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  QuizItem,
  CreateQuizInput,
} from "@/services/quizzesService";

interface QuizzesState {
  items: QuizItem[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: QuizzesState = {
  items: [],
  isLoading: false,
  isSaving: false,
  error: null,
  successMessage: null,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    fetchQuizzesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchQuizzesSuccess: (state, action: PayloadAction<QuizItem[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    fetchQuizzesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    createQuizzesRequest: (state, action: PayloadAction<CreateQuizInput[]>) => {
      void action;
      state.isSaving = true;
      state.error = null;
      state.successMessage = null;
    },
    createQuizzesSuccess: (state, action: PayloadAction<QuizItem[]>) => {
      state.isSaving = false;
      state.items = [...action.payload, ...state.items];
      state.successMessage = "Quizzes saved successfully.";
    },
    createQuizzesFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },

    updateQuizRequest: (
      state,
      action: PayloadAction<{ id: number; payload: CreateQuizInput }>,
    ) => {
      void action;
      state.isSaving = true;
      state.error = null;
      state.successMessage = null;
    },
    updateQuizSuccess: (state, action: PayloadAction<QuizItem>) => {
      state.isSaving = false;
      state.items = state.items.map((quiz) =>
        quiz.id === action.payload.id ? action.payload : quiz,
      );
      state.successMessage = "Quiz updated successfully.";
    },
    updateQuizFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },

    deleteQuizRequest: (state, action: PayloadAction<number>) => {
      void action;
      state.isSaving = true;
      state.error = null;
      state.successMessage = null;
    },
    deleteQuizSuccess: (state, action: PayloadAction<number>) => {
      state.isSaving = false;
      state.items = state.items.filter((quiz) => quiz.id !== action.payload);
      state.successMessage = "Quiz deleted successfully.";
    },
    deleteQuizFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },

    clearQuizStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  fetchQuizzesRequest,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  createQuizzesRequest,
  createQuizzesSuccess,
  createQuizzesFailure,
  updateQuizRequest,
  updateQuizSuccess,
  updateQuizFailure,
  deleteQuizRequest,
  deleteQuizSuccess,
  deleteQuizFailure,
  clearQuizStatus,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
