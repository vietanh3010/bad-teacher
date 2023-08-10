import clsx from "clsx";
import { memo } from "react"

type CMessageProps = {
    type: 'info' | 'success' | 'warn' | 'error',
    text: React.ReactNode,
}
const CMessage = ({
    type,
    text
}: CMessageProps): JSX.Element => {


    return (
        <div className={clsx(
            "px-4 py-3 rounded-md flex items-center space-x-2",
            type === 'info' && "bg-info-2/50 text-info-7",
            type === 'success' && "bg-success-2/50 text-success-7",
            type === 'warn' && "bg-warning-2/50 text-warning-7",
            type === 'error' && "bg-danger-2/50 text-danger-7",
        )}>
            <i className={clsx(
                "pi mb-0.5",
                type === 'info' && "pi-info-circle",
                type === 'success' && "pi-check",
                type === 'warn' && "pi-exclamation-triangle",
                type === 'error' && "pi-times-circle",
            )}></i>
            <span className="text-sm">{text}</span>
        </div>
    )
}

export default memo(CMessage);