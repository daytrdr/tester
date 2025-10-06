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
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId).then(setQuiz);
    }
  }, [quizId]);

  if (!quiz) return <div>Loading...</div>;

  const handleAnswer = (value: string) => {
    const newAnswers = [...selectedAnswers];
    const answerIndex = parseInt(value);
    newAnswers[currentIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    // Show feedback
    const correct = answerIndex === quiz.questions[currentIndex].correctIndex;
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
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
          <RadioGroup value={selected?.toString()} onValueChange={handleAnswer} disabled={showFeedback}>
            {question.options.map((option, idx) => {
              let optionClass = "flex items-center space-x-2 p-2 rounded";
              
              if (showFeedback) {
                if (idx === question.correctIndex) {
                  optionClass += " bg-green-100 border-2 border-green-500";
                } else if (idx === selected && idx !== question.correctIndex) {
                  optionClass += " bg-red-100 border-2 border-red-500";
                }
              }
              
              return (
                <div key={idx} className={optionClass}>
                  <RadioGroupItem value={idx.toString()} id={idx.toString()} />
                  <Label htmlFor={idx.toString()}>{option}</Label>
                  {showFeedback && idx === question.correctIndex && (
                    <span className="ml-auto text-green-600 font-semibold">✓ Correct</span>
                  )}
                  {showFeedback && idx === selected && idx !== question.correctIndex && (
                    <span className="ml-auto text-red-600 font-semibold">✗ Incorrect</span>
                  )}
                </div>
              );
            })}
          </RadioGroup>
          
          {showFeedback && (
            <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
              </p>
              {!isCorrect && (
                <p className="text-red-700 mt-1">
                  The correct answer is: {question.options[question.correctIndex]}
                </p>
              )}
            </div>
          )}
          
          <Button 
            className="mt-4" 
            onClick={nextQuestion} 
            disabled={selected === null}
            variant={showFeedback ? "default" : "secondary"}
          >
            {showFeedback 
              ? (currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz')
              : 'Submit Answer'
            }
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
