"use client"

interface ICodingQuestion {
    id: number,
    lessonId: string,
    questionNumber: number,
    markdown: string
}

interface IProps {
    codingQuestions: ICodingQuestion[] | undefined,
    currQuestionNum: number,
    updateCurrQuestionNum: (questionNum: number) => void;
}

export default function Tabs({codingQuestions, currQuestionNum, updateCurrQuestionNum} : IProps) {
    return (
        <div className="flex mt-4">
            {codingQuestions?.map((item) => (
                <button
                key={item.id}
                className={`px-4 py-2 rounded-t-2xl transition-colors duration-300 ${
                    item.questionNumber === currQuestionNum
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => updateCurrQuestionNum(item.questionNumber)}
                >
                Question #{item.questionNumber}
                </button>
            ))}

            <button className="px-4 py-2 rounded-t-lg transition-colors duration-300 
            bg-gray-900 text-gray-300 hover:bg-gray-600">
                +
            </button>
        </div>
    )
}