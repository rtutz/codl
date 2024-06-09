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
}

export default function Tab({codingQuestions, currQuestion, updateCurrQuestionNum} : IProps) {
    return (
        <div className="flex">
            {codingQuestions?.map((item, index) => (
                <button
                key={item.id}
                className={`px-4 py-2 rounded-t-2xl transition-colors duration-300 ${
                    item.id === currQuestion?.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => updateCurrQuestionNum(item)}
                >
                Question #{index + 1}
                </button>
            ))}

            <button className="px-4 py-2 rounded-t-lg transition-colors duration-300 
             text-gray-300 hover:bg-gray-700">
                +
            </button>
        </div>
    )
}