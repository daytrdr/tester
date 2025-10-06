import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizList from './components/QuizList.tsx';
import Quiz from './components/Quiz.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
