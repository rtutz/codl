"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

interface ChildProps {
    newLessonName: string;
    setNewLessonName: React.Dispatch<React.SetStateAction<string>>;
    submitNewLesson: () => void
  }

export default function NewLessonBtn({newLessonName, setNewLessonName, submitNewLesson}: ChildProps) {



    return(
        <Dialog>
        <DialogTrigger asChild>
            <Button className="max-w-fit my-10"> <PlusIcon className="h-4 w-4" />Create New Lesson</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
                <DialogTitle>Create New Lesson</DialogTitle>
                {/* <DialogDescription>
                    Create a new Lesson here. You must provide a unique name for this class.
                </DialogDescription> */}
            </DialogHeader>
            <div className="flex flex-col space-y-8">
                <div className="flex flex-col space-y-4">
                    <Label htmlFor="name">
                        Lesson Title
                    </Label>
                    <Input id="name" value={newLessonName} onChange={(e) => setNewLessonName(e.target.value)}/>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="submit" onClick={submitNewLesson}>Save changes</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}