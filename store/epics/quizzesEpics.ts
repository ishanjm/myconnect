import { Epic, ofType } from "redux-observable";
import { from, of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import {
  createQuizzesRequest,
  createQuizzesSuccess,
  createQuizzesFailure,
  deleteQuizRequest,
  deleteQuizSuccess,
  deleteQuizFailure,
  fetchQuizzesRequest,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  fetchQuizByIdRequest,
  fetchQuizByIdSuccess,
  fetchQuizByIdFailure,
  updateQuizRequest,
  updateQuizSuccess,
  updateQuizFailure,
} from "../slices/quizzes";
import { CreateQuizInput, quizzesService } from "@/services/quizzesService";

export const fetchQuizzesEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(fetchQuizzesRequest.type),
    mergeMap(() =>
      from(quizzesService.fetchQuizzes()).pipe(
        map((quizzes) => fetchQuizzesSuccess(quizzes)),
        catchError((error) =>
          of(fetchQuizzesFailure(error.response?.data?.error || "Failed to fetch quizzes")),
        ),
      ),
    ),
  );

export const fetchQuizByIdEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(fetchQuizByIdRequest.type),
    mergeMap((action: PayloadAction<number>) =>
      from(quizzesService.fetchQuizById(action.payload)).pipe(
        map((quiz) => fetchQuizByIdSuccess(quiz)),
        catchError((error) =>
          of(
            fetchQuizByIdFailure(
              error.response?.data?.error || "Failed to fetch quiz",
            ),
          ),
        ),
      ),
    ),
  );

export const createQuizzesEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(createQuizzesRequest.type),
    mergeMap((action: PayloadAction<CreateQuizInput[]>) =>
      from(quizzesService.createQuizzes(action.payload)).pipe(
        map((quizzes) => createQuizzesSuccess(quizzes)),
        catchError((error) =>
          of(createQuizzesFailure(error.response?.data?.error || "Failed to save quizzes")),
        ),
      ),
    ),
  );

export const updateQuizEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(updateQuizRequest.type),
    mergeMap(
      (action: PayloadAction<{ id: number; payload: CreateQuizInput }>) =>
        from(quizzesService.updateQuiz(action.payload.id, action.payload.payload)).pipe(
          map((quiz) => updateQuizSuccess(quiz)),
          catchError((error) =>
            of(updateQuizFailure(error.response?.data?.error || "Failed to update quiz")),
          ),
        ),
    ),
  );

export const deleteQuizEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(deleteQuizRequest.type),
    mergeMap((action: PayloadAction<number>) =>
      from(quizzesService.deleteQuiz(action.payload)).pipe(
        map(() => deleteQuizSuccess(action.payload)),
        catchError((error) =>
          of(deleteQuizFailure(error.response?.data?.error || "Failed to delete quiz")),
        ),
      ),
    ),
  );
