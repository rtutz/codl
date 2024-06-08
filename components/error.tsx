import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export default function ErrorUI({message}: {message: string}) {
    return (
       
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-1/4 m-10 z-50">
            <Alert variant="destructive" className="bg-red-500 text-white">
                <ExclamationTriangleIcon className="h-4 w-4 text-white" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Alert>
        </div>

    )
}