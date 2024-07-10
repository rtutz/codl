"use client"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface IQuizQuestion {
  id?: number;
  question: string;
  choices: { text: string; isCorrect: boolean, id: string }[];
  hint: string;
  modified: boolean
}

interface IndividualQuizProps {
  question: IQuizQuestion;
  onUpdate: (question: IQuizQuestion) => void;
}

export default function IndividualQuiz({ question, onUpdate }: IndividualQuizProps) {
  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...question, question: e.target.value });
  };

  const handleChoiceChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newChoices = [...question.choices];
    newChoices[index] = { ...newChoices[index], text: e.target.value };
    onUpdate({ ...question, choices: newChoices });
  };

  const handleCorrectAnswerChange = (index: number, checked: boolean | 'indeterminate') => {
    const newChoices = [...question.choices];
    newChoices[index] = { ...newChoices[index], isCorrect: checked === true };
    onUpdate({ ...question, choices: newChoices });
  }

  const handleHintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...question, hint: e.target.value });
  };

  return (
    <div className="w-3/4 mx-auto">
      {/* Question */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white mb-2">Question:</h2>
        <Textarea
          className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
          placeholder="Enter your question here..."
          value={question.question}
          onChange={handleQuestionChange}
        />
      </div>

      {/* Choices */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Choices:</h3>
        <div className="grid grid-cols-2 gap-4">
          {question.choices.map((choice, index) => (
            <div key={index}>
              <Input
                className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
                placeholder={`Choice ${index + 1}`}
                value={choice.text}
                onChange={(e) => handleChoiceChange(index, e)}
              />
              <Checkbox
                className="text-white mt-2"
                checked={choice.isCorrect}
                onCheckedChange={(checked) => handleCorrectAnswerChange(index, checked)}
                >
                Correct Answer
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      {/* Hint */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Hint:</h3>
        <Textarea
          className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
          placeholder="Enter a hint for the question..."
          value={question.hint}
          onChange={handleHintChange}
        />
      </div>
    </div>
  );
}