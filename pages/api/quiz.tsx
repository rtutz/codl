import { NextApiRequest, NextApiResponse } from "next";
import client from "@/prisma/client";

export const dynamic = "force-dynamic";

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

interface IQuizQuestion {
    id?: number;
    question: string;
    choices: { text: string; isCorrect: boolean, id: string | null }[];
    hint: string;
    modified: boolean;
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const lessonID = req.query.lesson_id ? (req.query.lesson_id as string) : undefined;
        const questionID = req.query.question_id ? parseInt(req.query.question_id as string, 10) : undefined;
                const userID = req.query.user_id ? (req.query.user_id as string) : undefined;


        if (questionID && userID) {
            try {
                const userAnswers = await client.userAnswers.findMany({
                    where: {
                        userId: userID,
                        quizId: questionID
                    },
                    select: {
                        choiceId: true
                    }
                });

                return res.status(200).json({ userAnswers });
            } catch (error) {
                console.error('Error fetching user answers:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }

        if (lessonID) {
            const quizData = await client.quiz.findMany({
                where: {
                    lessonId: lessonID
                },
                include: {
                    choices: true
                }
            })

            const updatedQuizData = quizData.map((quiz) => ({ ...quiz, modified: false }))

            return res.status(200).json(updatedQuizData);

        } else {
            res.status(405).json({ message: 'No lessonID attached' });
        }

    } else if (req.method === 'POST') {
        const lessonID = req.query.lesson_id as string;
        const questions: IQuizQuestion[] = req.body.questions;

        if (!lessonID) {
            return res.status(400).json({ message: 'No lessonID provided' });
        }

        if (!Array.isArray(questions)) {
            return res.status(400).json({ message: 'Invalid questions format' });
        }

        try {
            const results = await Promise.all(questions.map(async (question) => {
                if (!question.id) {
                    // Create new question
                    return await client.quiz.create({
                        data: {
                            question: question.question,
                            hint: question.hint,
                            lessonId: lessonID,
                            choices: {
                                create: question.choices.map(choice => ({
                                    text: choice.text,
                                    isCorrect: choice.isCorrect
                                }))
                            }
                        },
                        include: { choices: true }
                    });
                } else if (question.modified) {
                    // Update existing question
                    const updatedQuestion = await client.quiz.update({
                        where: { id: question.id },
                        data: {
                            question: question.question,
                            hint: question.hint,
                        },
                        include: { choices: true }
                    });

                    // Handle choices separately
                    await Promise.all(question.choices.map(async (choice) => {
                        if (choice.id === null) {
                            // Create new choice
                            await client.choice.create({
                                data: {
                                    text: choice.text,
                                    isCorrect: choice.isCorrect,
                                    questionId: updatedQuestion.id
                                }
                            });
                        } else {
                            // Update existing choice
                            await client.choice.update({
                                where: { id: parseInt(choice.id) },
                                data: {
                                    text: choice.text,
                                    isCorrect: choice.isCorrect
                                }
                            });
                        }
                    }));

                    return updatedQuestion;
                }
                // If not modified, return the original question
                return question;
            }));

            res.status(200).json(results);
        } catch (error) {
            console.error('Error processing questions:', error);
            res.status(500).json({ message: 'Error processing questions', error });
        }
    } else if (req.method === 'PATCH') {
        const { userId, selectedAnswers, quizId } = req.body;

        try {
            // Delete existing entries for the user
            await client.userAnswers.deleteMany({
                where: { userId, quizId },
            });

            // Create new entries for the selected answers
            const newEntries = selectedAnswers.map((choiceId: string) => ({
                userId,
                choiceId,
                quizId
            }));

            await client.userAnswers.createMany({
                data: newEntries,
            });


            res.status(200).json({ message: 'User answers updated successfully' });
        } catch (error) {
            console.error('Error updating user answers:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}