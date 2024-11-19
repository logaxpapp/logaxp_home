// src/types/appraisalQuestion.ts

/**
 * Defines the possible types of appraisal questions.
 */
export type QuestionType = 'Rating' | 'Text' | 'Multiple Choice';

/**
 * Interface representing an Appraisal Question.
 */
export interface IAppraisalQuestion {
  /**
   * The unique identifier for the appraisal question.
   */
  _id: string;

  /**
   * The text of the appraisal question.
   */
  question_text: string;

  /**
   * The type of the question, determining the kind of response expected.
   * - 'Rating': Numerical rating (e.g., 1-5)
   * - 'Text': Open-ended textual response
   * - 'Multiple Choice': Selection from predefined options
   */
  question_type: QuestionType;

  /**
   * The options available for 'Multiple Choice' type questions.
   * This field is required if `question_type` is 'Multiple Choice'.
   */
  options?: string[];

  /**
   * The type of appraisal this question is associated with.
   * Examples: 'Annual', 'Mid-Year', etc.
   */
  appraisal_type?: string;

  /**
   * The specific period during which this appraisal question is relevant.
   * Examples: 'Q1', 'Q2', etc.
   */
  period?: string;

  /**
   * Timestamp indicating when the appraisal question was created.
   * Represented as an ISO 8601 string.
   */
  created_at: string;

  /**
   * Timestamp indicating when the appraisal question was last updated.
   * Represented as an ISO 8601 string.
   */
  updated_at: string;
}
