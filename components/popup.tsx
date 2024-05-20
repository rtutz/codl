import { ReactNode } from "react";

interface Props {
    shouldShow: boolean;
    onRequestClose: () => void;
    children: ReactNode
}

export default function Popup({shouldShow, onRequestClose, children}: Props) {
    if (shouldShow) {
        return (
            <div>
                Showing popup
            </div>
        )
    } else {
        return (
            null
        )
    }
}