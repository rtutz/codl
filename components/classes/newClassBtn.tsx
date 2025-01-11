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
    newClassName: string;
    setNewClassName: React.Dispatch<React.SetStateAction<string>>;
    submitNewClass: () => void
  }

export default function NewClassBtn({newClassName, setNewClassName, submitNewClass}: ChildProps) {



    return(
        <Dialog>
        <DialogTrigger asChild>
            <Button> <PlusIcon className="h-4 w-4" />Create New Class</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <DialogDescription>
                    Create a new class here. You must provide a unique name for this class.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-8">
                <div className="flex flex-col space-y-4">
                    <Label htmlFor="name">
                        Class Display Name
                    </Label>
                    <Input id="name" value={newClassName} onChange={(e) => setNewClassName(e.target.value)}/>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="submit" onClick={submitNewClass}>Save changes</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}