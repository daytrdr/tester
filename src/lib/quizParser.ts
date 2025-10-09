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

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('# ')) {
      title = trimmedLine.slice(2).trim();
    } else if (trimmedLine.startsWith('## ')) {
      if (currentQuestion && currentQuestion.correctIndex !== null) {
        const question: Question = {
          text: currentQuestion.text,
          options: currentQuestion.options,
          correctIndex: currentQuestion.correctIndex,
        };
        if (currentQuestion.images.length > 0) {
          question.images = currentQuestion.images;
        }
        if (currentQuestion.youtubeUrl) {
          question.youtubeUrl = currentQuestion.youtubeUrl;
        }
        questions.push(question);
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
    const question: Question = {
      text: currentQuestion.text,
      options: currentQuestion.options,
      correctIndex: currentQuestion.correctIndex,
    };
    if (currentQuestion.images.length > 0) {
      question.images = currentQuestion.images;
    }
    if (currentQuestion.youtubeUrl) {
      question.youtubeUrl = currentQuestion.youtubeUrl;
    }
    questions.push(question);
  }

  return { title, questions };
}
