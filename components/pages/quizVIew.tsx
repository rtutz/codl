"use client"

import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useLessonIdContext } from "@/app/context/lessonContext"


interface IQuizView {
    lessonID: string
}

export default function QuizView({ lessonID }: IQuizView) {
    const [lessonId, setLessonId] = useLessonIdContext();
    console.log("LessonId that is seen in coding.tsx is ", lessonId)

    return (
        // 
        <div className="w-3/4 mx-auto">
            {/* Question */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">Question:</h2>
                <Textarea
                    className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
                    placeholder="Enter your question here..."
                />
            </div>

            {/* Choices */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Choices:</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Input
                            className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
                            placeholder="Choice 1"
                        />
                        <Checkbox className="text-white mt-2">Correct Answer</Checkbox>
                    </div>
                    <div>
                        <Input
                            className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
                            placeholder="Choice 2"
                        />
                        <Checkbox className="text-white mt-2">Correct Answer</Checkbox>
                    </div>
                    <div>
                        <Input
                            className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
                            placeholder="Choice 3"
                        />
                        <Checkbox className="text-white mt-2">Correct Answer</Checkbox>
                    </div>
                    <div>
                        <Input
                            className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
                            placeholder="Choice 4"
                        />
                        <Checkbox className="text-white mt-2">Correct Answer</Checkbox>
                    </div>
                </div>
            </div>

            {/* Hint */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Hint:</h3>
                <Textarea
                    className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
                    placeholder="Enter a hint for the question..."
                />
            </div>
        </div>
    )

}