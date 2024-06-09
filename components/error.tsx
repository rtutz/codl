import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface IAlert {
    message: string,
    styling: "destructive" | "default" | null | undefined
}

export default function AlertUI({ message, styling = "default" }: IAlert) {
    console.log(styling);
    return (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-1/4 m-10 z-50">
            <Alert
                variant={styling}
                className={`${styling === 'destructive' ? 'bg-red-500 text-white' : ''}`}
            >
                <ExclamationTriangleIcon className="h-4 w-4 text-white" />
                {styling === 'destructive' ? (
                    <AlertTitle>Error</AlertTitle>
                ) : (
                    <AlertTitle>Success</AlertTitle>
                )}
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Alert>
        </div>

    )
}