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
  const [currentSelection, setCurrentSelection] = useState<number | undefined>(undefined);
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
    const answerIndex = parseInt(value);
    setCurrentSelection(answerIndex);
    // Don't show feedback yet - wait for submit button
  };

  const handleSubmit = () => {
    if (currentSelection === undefined) return;
    
    // Save the answer to the array
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = currentSelection;
    setSelectedAnswers(newAnswers);
    
    // Show feedback when submit button is clicked
    const correct = currentSelection === quiz.questions[currentIndex].correctIndex;
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setCurrentSelection(undefined); // Clear selection for next question
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const question = quiz.questions[currentIndex];
  const selected = currentSelection;

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

  // Helper function to extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string) => {
    // Handle youtube.com/watch?v=... and youtu.be/... formats
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return null;
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
      <p className="mb-4">Question {currentIndex + 1} of {quiz.questions.length}</p>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg mb-4">{question.text}</h3>
          
          {/* Display images if present */}
          {question.images && question.images.length > 0 && (
            <div className="mb-4 space-y-2">
              {question.images.map((imageUrl, idx) => (
                <img 
                  key={idx} 
                  src={imageUrl} 
                  alt={`Question image ${idx + 1}`} 
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              ))}
            </div>
          )}
          
          {/* Display YouTube video if present */}
          {question.youtubeUrl && (
            <div className="mb-4 aspect-video">
              <iframe
                className="w-full h-full rounded-lg shadow-md"
                src={getYouTubeEmbedUrl(question.youtubeUrl) || ''}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          
          <RadioGroup key={currentIndex} value={selected !== undefined ? selected.toString() : undefined} onValueChange={handleAnswer} disabled={showFeedback}>
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
            onClick={showFeedback ? nextQuestion : handleSubmit} 
            disabled={selected === undefined}
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
