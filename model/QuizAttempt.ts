import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface QuizAttemptAnswer {
  questionIndex: number;
  selectedAnswerIndex: number;
  isCorrect: boolean;
}

export interface QuizAttemptAttributes {
  id: number;
  quizId: number;
  quizTitle: string;
  userId: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage 0-100
  answers: QuizAttemptAnswer[];
  timeTakenSeconds: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type QuizAttemptCreationAttributes = Optional<
  QuizAttemptAttributes,
  "id" | "createdAt" | "updatedAt"
>;

const QuizAttempt = sequelize.define<
  Model<QuizAttemptAttributes, QuizAttemptCreationAttributes>
>(
  "QuizAttempt",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    quizId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quizTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    totalQuestions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correctAnswers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    timeTakenSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "quiz_attempts",
  },
);

export default QuizAttempt;
export { QuizAttempt };
