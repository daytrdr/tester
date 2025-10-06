import { parseQuiz } from './quizParser';

export interface QuizList {
  [key: string]: ReturnType<typeof parseQuiz>;
}

export async function loadQuizzes(): Promise<QuizList> {
  const quizzes: QuizList = {};

  const modules = import.meta.glob('/src/quizzes/*.md', { query: '?raw', import: 'default' });
  for (const path in modules) {
    const md = await modules[path]();
    const quizId = path.replace(/^\/src\/quizzes\//, '').replace(/\.md$/, '');
    quizzes[quizId] = parseQuiz(md as string);
  }

  return quizzes;
}

export async function loadQuiz(quizId: string) {
  const module = import.meta.glob('/src/quizzes/*.md', { query: '?raw', import: 'default' })[`/src/quizzes/${quizId}.md`];
  if (!module) throw new Error(`Quiz ${quizId} not found`);
  const md = await module();
  return parseQuiz(md as string);
}
