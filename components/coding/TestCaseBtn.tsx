"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";import { useState } from "react"

interface TestCaseProps {
  id: string;
  givenInput: string;
  givenOutput: string;
  message: string;
  handleSubmit: (id: string, input: string, output: string) => void;
  variant?: "default" | "outline"; 
  children?: React.ReactNode
}

const TestCaseBtn = ({ id, givenInput, givenOutput, handleSubmit, message, variant, children }: TestCaseProps) => {
  const [input, setInput] = useState<string>(givenInput);
  const [output, setOutput] = useState<string>(givenOutput);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant={variant} className="w-full justify-start">
        {children || message}
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{message}</DialogTitle>
        <DialogDescription>
          Enter the input and expected output for this test case.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="input" className="text-right">
            Input
          </Label>
          <Input
            id="input"
            value={input}
            className="col-span-3"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="output" className="text-right">
            Output
          </Label>
          <Input
            id="output"
            value={output}
            className="col-span-3"
            onChange={(e) => setOutput(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          onClick={() => {
            handleSubmit(id, input, output)
            setOpen(false)
            setInput('')
            setOutput('')
          }}
        >
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default TestCaseBtn;