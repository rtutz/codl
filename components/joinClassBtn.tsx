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
    classID: string;
    setClassID: React.Dispatch<React.SetStateAction<string>>;
    submitJoinClass: () => void
  }

export default function JoinClassBtn({classID, setClassID, submitJoinClass}: ChildProps) {



    return(
        <Dialog>
        <DialogTrigger asChild>
            <Button> <PlusIcon className="h-4 w-4" />Join a Class</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
                <DialogTitle>Join Class</DialogTitle>
                {/* <DialogDescription>
                    Create a new class here. You must provide a unique name for this class.
                </DialogDescription> */}
            </DialogHeader>
            <div className="flex flex-col space-y-8">
                <div className="flex flex-col space-y-4">
                    <Label htmlFor="name">
                        Class ID
                    </Label>
                    <Input id="name" value={classID} onChange={(e) => setClassID(e.target.value)}/>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="submit" onClick={submitJoinClass}>Join!</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}