export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  title: string;
  questions: Question[];
}

export function parseQuiz(md: string): Quiz {
  const lines = md.split('\n');
  let title = '';
  const questions: Question[] = [];
  let currentQuestion: { text: string; options: string[]; correctIndex: number | null } | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('# ')) {
      title = trimmedLine.slice(2).trim();
    } else if (trimmedLine.startsWith('## ')) {
      if (currentQuestion && currentQuestion.correctIndex !== null) {
        questions.push({
          text: currentQuestion.text,
          options: currentQuestion.options,
          correctIndex: currentQuestion.correctIndex,
        });
      }
      currentQuestion = {
        text: trimmedLine.slice(3).trim(),
        options: [],
        correctIndex: null,
      };
    } else if (trimmedLine.startsWith('- ')) {
      if (currentQuestion) {
        const isChecked = trimmedLine.includes('[x]');
        const optionText = trimmedLine.replace(/^-\s*\[\s*[x ]\s*\]\s*/, '').trim();
        if (isChecked) currentQuestion.correctIndex = currentQuestion.options.length;
        currentQuestion.options.push(optionText);
      }
    }
  }

  if (currentQuestion && currentQuestion.correctIndex !== null) {
    questions.push({
      text: currentQuestion.text,
      options: currentQuestion.options,
      correctIndex: currentQuestion.correctIndex,
    });
  }

  return { title, questions };
}
