import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useClassRole } from '@/app/context/roleContext';

interface IQuizQuestion {
  id?: number;
  question: string;
  choices: { text: string; isCorrect: boolean; id: string }[];
  hint?: string;
}

interface Props {
  lessonID: string;
  quizQuestions: IQuizQuestion[];
}

const StudentQuiz = ({ lessonID, quizQuestions }: Props) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const { userId } = useClassRole();

  useEffect(() => {
    const fetchUserAnswers = async () => {
      if (!currentQuestion.id || !userId) return;

      try {
        const response = await fetch(`/api/quiz?question_id=${currentQuestion.id}&user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data && data.userAnswers) {
          const correctAnswers = data.userAnswers.map((answer: any) => answer.choiceId);
          setSelectedAnswers(correctAnswers);

          if (correctAnswers.length > 0) {
            const allCorrect = correctAnswers.every((answerId: String) => {
              const selectedChoice = currentQuestion.choices.find(choice => choice.id === answerId);
              return selectedChoice?.isCorrect;
            });
            const allSelectedCorrect = currentQuestion.choices
              .filter(choice => choice.isCorrect)
              .every(choice => correctAnswers.includes(choice.id));
            setIsCorrect(allCorrect && allSelectedCorrect);
            setIsAnswerSubmitted(true);
          }
        } else {
          setSelectedAnswers([]);
        }
      } catch (error) {
        console.error('Error fetching user answers:', error);
        setSelectedAnswers([]);
      }
    };

    fetchUserAnswers();
  }, [currentQuestionIndex, userId]);

  const handleAnswerSelection = (answerId: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswers(prevSelected =>
        prevSelected.includes(answerId)
          ? prevSelected.filter(id => id !== answerId)
          : [...prevSelected, answerId]
      );
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    }
  };


  const handleSubmit = async () => {
    if (selectedAnswers.length > 0) {
      const allCorrect = selectedAnswers.every(answerId => {
        const selectedChoice = currentQuestion.choices.find(choice => choice.id === answerId);
        return selectedChoice?.isCorrect;
      });
      const allSelectedCorrect = currentQuestion.choices
        .filter(choice => choice.isCorrect)
        .every(choice => selectedAnswers.includes(choice.id));
      setIsCorrect(allCorrect && allSelectedCorrect);
      setIsAnswerSubmitted(true);

      try {
        const response = await fetch('/api/quiz', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            selectedAnswers,
            quizId: currentQuestion.id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update user answers');
        }

        const data = await response.json();
        console.log('User answers updated successfully:', data);
      } catch (error) {
        console.error('Error updating user answers:', error);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswers([]);
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswers([]);
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Question {currentQuestionIndex + 1} of {quizQuestions.length}</h2>
        <Progress value={(currentQuestionIndex + 1) / quizQuestions.length * 100} className="w-full" />
      </div>

      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
        <div className="space-y-4">
          {currentQuestion.choices.map((choice) => (
            <div
              key={choice.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${isAnswerSubmitted
                ? 'border-gray-600 bg-gray-800 opacity-50'
                : 'border-gray-700 hover:bg-gray-800 cursor-pointer'
                } transition-all duration-200`}
              onClick={() => !isAnswerSubmitted && handleAnswerSelection(choice.id)}
            >
              <Checkbox
                checked={selectedAnswers.includes(choice.id)}
                onChange={() => !isAnswerSubmitted && handleAnswerSelection(choice.id)}
                id={choice.id}
                disabled={isAnswerSubmitted}
                className={isAnswerSubmitted ? 'opacity-50 cursor-not-allowed' : ''}
              />
              <Label
                htmlFor={choice.id}
                className={`flex-grow ${isAnswerSubmitted ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-gray-200'
                  }`}
              >
                {choice.text}
              </Label>
            </div>
          ))}
        </div>

        {currentQuestion.hint && (
          <Alert className="mt-6 bg-gray-800 text-gray-400">
            <AlertDescription>{currentQuestion.hint}</AlertDescription>
          </Alert>
        )}

        {isAnswerSubmitted && (
          <Alert className={`mt-6 ${isCorrect ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            <AlertDescription>
              {isCorrect ? 'Correct answer!' : 'Incorrect answer. Try again!'}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="w-28"
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={selectedAnswers.length === 0 || isAnswerSubmitted}
          className="w-28"
        >
          Submit
        </Button>
        <Button
          variant="outline"
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === quizQuestions.length - 1}
          className="w-28"
        >
          Next <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StudentQuiz;