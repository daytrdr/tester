import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadQuiz } from '../lib/loadQuizzes';
import type { Quiz as QuizType } from '../lib/quizParser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Quiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId).then(setQuiz);
    }
  }, [quizId]);

  if (!quiz) return <div>Loading...</div>;

  const handleAnswer = (value: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = parseInt(value);
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const question = quiz.questions[currentIndex];
  const selected = selectedAnswers[currentIndex] !== undefined ? selectedAnswers[currentIndex] : null;

  if (showResult) {
    const score = selectedAnswers.reduce((acc, ans, idx) => acc + (ans === quiz.questions[idx].correctIndex ? 1 : 0), 0);
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl mb-4">Your score: {score}/{quiz.questions.length}</p>
            <Link to="/">
              <Button>Back to Quizzes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
      <p className="mb-4">Question {currentIndex + 1} of {quiz.questions.length}</p>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg mb-4">{question.text}</h3>
          <RadioGroup value={selected?.toString()} onValueChange={handleAnswer}>
            {question.options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={idx.toString()} id={idx.toString()} />
                <Label htmlFor={idx.toString()}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button className="mt-4" onClick={nextQuestion} disabled={selected === null}>
            {currentIndex < quiz.questions.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
