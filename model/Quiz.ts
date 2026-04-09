import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface QuizAnswer {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  prompt: string;
  answers: QuizAnswer[];
}

export interface QuizAttributes {
  id: number;
  title: string;
  questions: QuizQuestion[];
  userId: number;
  accessKey: string;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateQuizPayload = {
  title: string;
  questions: QuizQuestion[];
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
};

type QuizCreationAttributes = Optional<
  QuizAttributes,
  "id" | "createdAt" | "updatedAt"
>;

const Quiz = sequelize.define<Model<QuizAttributes, QuizCreationAttributes>>(
  "Quiz",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    accessKey: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    shuffleQuestions: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    shuffleAnswers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "quizzes",
  },
);

export default Quiz;
export { Quiz };
