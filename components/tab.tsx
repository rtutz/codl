"use client"
interface ICodingQuestion {
    id: string,
    lessonId: string,
    markdown: string
}

interface IProps {
    codingQuestions: ICodingQuestion[] | undefined,
    currQuestion: ICodingQuestion | undefined,
    updateCurrQuestionNum: (questionNum: ICodingQuestion) => void;
    setCodingQuestions: React.Dispatch<React.SetStateAction<ICodingQuestion[] | undefined>>;
}

export default function Tab({ codingQuestions, currQuestion, updateCurrQuestionNum, setCodingQuestions }: IProps) {
    const addNewTab = () => {
        if (codingQuestions) {
            const newQuestion: ICodingQuestion = {
                id: `q${codingQuestions.length + 1}`,
                lessonId: `l${codingQuestions.length + 1}`,
                markdown: ''
            };
            setCodingQuestions([...codingQuestions, newQuestion]);
            updateCurrQuestionNum(newQuestion);
        } else {
            const newQuestion: ICodingQuestion = {
                id: 'q1',
                lessonId: 'l1',
                markdown: ''
            };
            setCodingQuestions([newQuestion]);
            updateCurrQuestionNum(newQuestion);
        }
    };

    const removeTab = (questionToRemove: ICodingQuestion) => {
        setCodingQuestions(prev => {
            if (!prev) return prev;
            const newQuestions = prev.filter(q => q.id !== questionToRemove.id);
            if (newQuestions.length > 0 && currQuestion?.id === questionToRemove.id) {
                updateCurrQuestionNum(newQuestions[0]);
            }
            return newQuestions;
        });
    };

    return (
        <div className="w-1/2">
            <div className="flex min-w-full">
                {codingQuestions?.map((item, index) => (
                    <button
                        key={item.id}
                        className={`px-4 py-2 rounded-t-2xl transition-colors duration-300 flex-shrink-0 ${item.id === currQuestion?.id
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        onClick={() => updateCurrQuestionNum(item)}>
                        Question #{index + 1}

                        {item.id === currQuestion?.id && (
                            <button
                                className="ml-2 text-gray-500 hover:text-white text-lg"
                                onClick={() => removeTab(item)}
                            >
                                ×
                            </button>
                        )}
                    </button>
                ))}

                <button
                    className="px-4 rounded-t-lg transition-colors duration-300 
                    text-gray-300 hover:bg-gray-700 flex-shrink-0"
                    onClick={addNewTab}
                >
                    +
                </button>
            </div>
        </div>
    )
}