"use client"

import { useState } from "react";
import { Button } from "./ui/button";

interface ICoding {
    lessonID: string
}

export default function Coding({lessonID} : ICoding) {
    const [state, setState] = useState('testing');

    console.log(lessonID);
    return (
        <div>
            {state}
            <Button onClick={() => setState("Hopefully this works")}>
                Testing
            </Button>
        </div>
    )
}