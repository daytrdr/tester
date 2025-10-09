export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  images?: string[];
  youtubeUrl?: string;
}

export interface Quiz {
  title: string;
  questions: Question[];
}

export function parseQuiz(md: string): Quiz {
  const lines = md.split('\n');
  let title = '';
  const questions: Question[] = [];
  let currentQuestion: { 
    text: string; 
    options: string[]; 
    correctIndex: number | null;
    images: string[];
    youtubeUrl?: string;
  } | null = null;

  function buildQuestion(q: { text: string; options: string[]; correctIndex: number | null; images: string[]; youtubeUrl?: string; }): Question {
    const question: Question = {
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex as number,
    };
    if (q.images.length > 0) {
      question.images = q.images;
    }
    if (q.youtubeUrl) {
      question.youtubeUrl = q.youtubeUrl;
    }
    return question;
  }

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('# ')) {
      title = trimmedLine.slice(2).trim();
    } else if (trimmedLine.startsWith('## ')) {
      if (currentQuestion && currentQuestion.correctIndex !== null) {
        questions.push(buildQuestion(currentQuestion));
      }
      currentQuestion = {
        text: trimmedLine.slice(3).trim(),
        options: [],
        correctIndex: null,
        images: [],
      };
    } else if (trimmedLine.startsWith('![') && trimmedLine.includes('](')) {
      // Parse markdown image syntax: ![alt text](url)
      if (currentQuestion) {
        const match = trimmedLine.match(/!\[.*?\]\((.*?)\)/);
        if (match && match[1]) {
          currentQuestion.images.push(match[1]);
        }
      }
    } else if (trimmedLine.startsWith('youtube:')) {
      // Parse youtube URL: youtube: https://www.youtube.com/watch?v=...
      if (currentQuestion) {
        const youtubeUrl = trimmedLine.slice(8).trim();
        currentQuestion.youtubeUrl = youtubeUrl;
      }
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
    questions.push(buildQuestion(currentQuestion));
  }

  return { title, questions };
}
