"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { 
  clearQuizStatus, 
  createQuizzesRequest, 
  fetchQuizByIdRequest, 
  updateQuizRequest 
} from "@/store/slices/quizzes";

type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  prompt: string;
  answers: Answer[];
};

type Quiz = {
  id: string;
  title: string;
  questions: Question[];
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
};

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createAnswer = (): Answer => ({
  id: createId(),
  text: "",
  isCorrect: false,
});

const createQuestion = (): Question => ({
  id: createId(),
  prompt: "",
  answers: [createAnswer(), createAnswer()],
});

const createQuiz = (): Quiz => ({
  id: createId(),
  title: "",
  questions: [createQuestion()],
  shuffleQuestions: false,
  shuffleAnswers: false,
});

export default function QuizBuilderPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizIdParam = searchParams.get("id");
  const editQuizId = quizIdParam ? Number(quizIdParam) : null;

  const { isSaving, error, successMessage, isLoading, items } = useSelector(
    (state: RootState) => state.quizzes,
  );
  const [quizzes, setQuizzes] = useState<Quiz[]>([createQuiz()]);

  // Fetch quiz for editing
  useEffect(() => {
    if (editQuizId) {
      dispatch(fetchQuizByIdRequest(editQuizId));
    }
  }, [editQuizId, dispatch]);

  // Populate state with fetched quiz
  useEffect(() => {
    if (editQuizId && items.length > 0) {
      const quizToEdit = items.find(q => q.id === editQuizId);
      if (quizToEdit) {
        setQuizzes([{
          id: quizToEdit.id.toString(),
          title: quizToEdit.title,
          shuffleQuestions: !!quizToEdit.shuffleQuestions,
          shuffleAnswers: !!quizToEdit.shuffleAnswers,
          questions: quizToEdit.questions.map(q => ({
            id: createId(),
            prompt: q.prompt,
            answers: q.answers.map(a => ({
              id: createId(),
              text: a.text,
              isCorrect: a.isCorrect
            }))
          }))
        }]);
      }
    }
  }, [editQuizId, items]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        router.push("/profile?tab=Quiz");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, router]);

  useEffect(() => {
    return () => {
      dispatch(clearQuizStatus());
    };
  }, [dispatch]);

  const addQuiz = () => {
    setQuizzes((prev) => [...prev, createQuiz()]);
  };

  const removeQuiz = (quizId: string) => {
    setQuizzes((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((quiz) => quiz.id !== quizId);
    });
  };

  const updateQuizTitle = (quizId: string, value: string) => {
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz.id === quizId ? { ...quiz, title: value } : quiz,
      ),
    );
  };

  const toggleShuffleQuestions = (quizId: string) => {
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz.id === quizId
          ? { ...quiz, shuffleQuestions: !quiz.shuffleQuestions }
          : quiz,
      ),
    );
  };

  const toggleShuffleAnswers = (quizId: string) => {
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz.id === quizId
          ? { ...quiz, shuffleAnswers: !quiz.shuffleAnswers }
          : quiz,
      ),
    );
  };

  const addQuestion = (quizId: string) => {
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz.id === quizId
          ? { ...quiz, questions: [...quiz.questions, createQuestion()] }
          : quiz,
      ),
    );
  };

  const removeQuestion = (quizId: string, questionId: string) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz.id !== quizId) return quiz;
        if (quiz.questions.length <= 1) return quiz;

        return {
          ...quiz,
          questions: quiz.questions.filter(
            (question) => question.id !== questionId,
          ),
        };
      }),
    );
  };

  const updateQuestionPrompt = (
    quizId: string,
    questionId: string,
    prompt: string,
  ) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz.id !== quizId) return quiz;

        return {
          ...quiz,
          questions: quiz.questions.map((question) =>
            question.id === questionId ? { ...question, prompt } : question,
          ),
        };
      }),
    );
  };

  const addAnswer = (quizId: string, questionId: string) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz.id !== quizId) return quiz;

        return {
          ...quiz,
          questions: quiz.questions.map((question) =>
            question.id === questionId
              ? { ...question, answers: [...question.answers, createAnswer()] }
              : question,
          ),
        };
      }),
    );
  };

  const removeAnswer = (
    quizId: string,
    questionId: string,
    answerId: string,
  ) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz.id !== quizId) return quiz;

        return {
          ...quiz,
          questions: quiz.questions.map((question) => {
            if (question.id !== questionId) return question;
            if (question.answers.length <= 2) return question;

            return {
              ...question,
              answers: question.answers.filter(
                (answer) => answer.id !== answerId,
              ),
            };
          }),
        };
      }),
    );
  };

  const updateAnswerText = (
    quizId: string,
    questionId: string,
    answerId: string,
    text: string,
  ) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz.id !== quizId) return quiz;

        return {
          ...quiz,
          questions: quiz.questions.map((question) => {
            if (question.id !== questionId) return question;

            return {
              ...question,
              answers: question.answers.map((answer) =>
                answer.id === answerId ? { ...answer, text } : answer,
              ),
            };
          }),
        };
      }),
    );
  };

  const setCorrectAnswer = (
    quizId: string,
    questionId: string,
    answerId: string,
  ) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz.id !== quizId) return quiz;

        return {
          ...quiz,
          questions: quiz.questions.map((question) => {
            if (question.id !== questionId) return question;

            return {
              ...question,
              answers: question.answers.map((answer) => ({
                ...answer,
                isCorrect: answer.id === answerId,
              })),
            };
          }),
        };
      }),
    );
  };

  const isQuizValid = quizzes.every(
    (quiz) =>
      quiz.title.trim().length > 0 &&
      quiz.questions.length > 0 &&
      quiz.questions.every(
        (question) =>
          question.prompt.trim().length > 0 &&
          question.answers.every((answer) => answer.text.trim().length > 0) &&
          question.answers.some((answer) => answer.isCorrect),
      ),
  );

  const handleSaveQuizzes = async () => {
    if (!isQuizValid || isSaving) return;

    dispatch(clearQuizStatus());

    if (editQuizId) {
      const quiz = quizzes[0];
      dispatch(
        updateQuizRequest({
          id: editQuizId,
          payload: {
            title: quiz.title.trim(),
            questions: quiz.questions.map((question) => ({
              prompt: question.prompt.trim(),
              answers: question.answers.map((answer) => ({
                text: answer.text.trim(),
                isCorrect: answer.isCorrect,
              })),
            })),
            shuffleQuestions: quiz.shuffleQuestions,
            shuffleAnswers: quiz.shuffleAnswers,
          },
        }),
      );
    } else {
      dispatch(
        createQuizzesRequest(
          quizzes.map((quiz) => ({
            title: quiz.title.trim(),
            questions: quiz.questions.map((question) => ({
              prompt: question.prompt.trim(),
              answers: question.answers.map((answer) => ({
                text: answer.text.trim(),
                isCorrect: answer.isCorrect,
              })),
            })),
            shuffleQuestions: quiz.shuffleQuestions,
            shuffleAnswers: quiz.shuffleAnswers,
          })),
        ),
      );
    }
  };

  return (
    <div className="min-h-screen bg-bg px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h1 className="text-2xl font-extrabold text-fg">
            {editQuizId ? "Edit Quiz" : "Quiz Builder"}
          </h1>
          <p className="mt-2 text-sm text-fg opacity-70">
            {editQuizId 
              ? "Update your quiz details, questions, and answers."
              : "Create multiple quizzes. Each quiz can include multiple questions with answers and one correct answer per question."
            }
          </p>
        </div>

        {quizzes.map((quiz, quizIndex) => (
          <div
            key={quiz.id}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-fg">
                Quiz {quizIndex + 1}
              </h2>
              <button
                type="button"
                onClick={() => removeQuiz(quiz.id)}
                className={`rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer ${editQuizId ? 'hidden' : ''}`}
              >
                Remove Quiz
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-fg opacity-60">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quiz.title}
                  onChange={(event) =>
                    updateQuizTitle(quiz.id, event.target.value)
                  }
                  placeholder="Example: JavaScript Basics"
                  className="w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm text-fg outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 py-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <div 
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${quiz.shuffleQuestions ? 'bg-accent' : 'bg-gray-300'}`}
                    onClick={() => toggleShuffleQuestions(quiz.id)}
                  >
                    <span 
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${quiz.shuffleQuestions ? 'translate-x-5' : 'translate-x-0.5'}`} 
                    />
                  </div>
                  <span className="text-sm font-medium text-fg opacity-80">Shuffle Questions</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <div 
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${quiz.shuffleAnswers ? 'bg-accent' : 'bg-gray-300'}`}
                    onClick={() => toggleShuffleAnswers(quiz.id)}
                  >
                    <span 
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${quiz.shuffleAnswers ? 'translate-x-5' : 'translate-x-0.5'}`} 
                    />
                  </div>
                  <span className="text-sm font-medium text-fg opacity-80">Shuffle Answers</span>
                </label>
              </div>

              <div className="space-y-4">
                {quiz.questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-fg">
                        Question {questionIndex + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeQuestion(quiz.id, question.id)}
                        className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-fg hover:bg-accent/10 cursor-pointer"
                      >
                        Remove Question
                      </button>
                    </div>

                    <textarea
                      value={question.prompt}
                      onChange={(event) =>
                        updateQuestionPrompt(
                          quiz.id,
                          question.id,
                          event.target.value,
                        )
                      }
                      placeholder="Type your quiz question"
                      rows={3}
                      className="mb-3 w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm text-fg outline-none focus:border-accent"
                    />

                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-fg opacity-60">
                      Answers (pick one correct answer)
                    </p>

                    <div className="space-y-2">
                      {question.answers.map((answer, answerIndex) => (
                        <div
                          key={answer.id}
                          className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border border-border px-3 py-2"
                        >
                          <input
                            type="radio"
                            name={`correct-answer-${quiz.id}-${question.id}`}
                            checked={answer.isCorrect}
                            onChange={() =>
                              setCorrectAnswer(quiz.id, question.id, answer.id)
                            }
                            className="h-4 w-4 cursor-pointer"
                            title="Mark as correct"
                          />

                          <input
                            type="text"
                            value={answer.text}
                            onChange={(event) =>
                              updateAnswerText(
                                quiz.id,
                                question.id,
                                answer.id,
                                event.target.value,
                              )
                            }
                            placeholder={`Answer ${answerIndex + 1}`}
                            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-fg outline-none focus:border-accent"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeAnswer(quiz.id, question.id, answer.id)
                            }
                            className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-fg opacity-70 hover:opacity-100 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addAnswer(quiz.id, question.id)}
                      className="mt-3 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-fg hover:bg-accent/10 cursor-pointer"
                    >
                      + Add Answer
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addQuestion(quiz.id)}
                  className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-fg hover:bg-accent/10 cursor-pointer"
                >
                  + Add Question
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          {!editQuizId && (
            <button
              type="button"
              onClick={addQuiz}
              className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-white shadow-sm hover:opacity-90 cursor-pointer"
            >
              + Add Another Quiz
            </button>
          )}

          <span
            className={`text-sm font-semibold ${
              isQuizValid ? "text-green-600" : "text-amber-600"
            }`}
          >
            {isQuizValid
              ? "All quizzes are complete and ready."
              : "Complete title, each question, and mark one correct answer per question."}
          </span>

          <button
            type="button"
            onClick={handleSaveQuizzes}
            disabled={!isQuizValid || isSaving}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90 cursor-pointer"
          >
            {isSaving ? "Saving..." : editQuizId ? "Update Quiz" : "Save Quizzes"}
          </button>

          {(successMessage || error) && (
            <span
              className={`text-sm font-semibold ${
                successMessage
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {successMessage || error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
