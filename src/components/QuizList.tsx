import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadQuizzes } from '../lib/loadQuizzes';
import type { Quiz as QuizType } from '../lib/quizParser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<Record<string, QuizType>>({});

  useEffect(() => {
    loadQuizzes().then(setQuizzes);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Available Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(quizzes).map(([id, quiz]) => (
          <Card key={id} className="shadow-md">
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.questions.length} questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={`/quiz/${id}`}>
                <Button className="w-full">Take Quiz</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
