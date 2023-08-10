import { memo } from "react"
import { ProgressSpinner } from 'primereact/progressspinner';

const RouteLoading = (): JSX.Element => {

    return (
        <div className="fixed flex justify-center items-center inset-0 h-full w-full">
            <ProgressSpinner 
                style={{width: '50px', height: '50px'}} 
                strokeWidth="8" 
                fill="var(--surface-ground)" 
                animationDuration="1s" />
        </div>
    )
}

export default memo(RouteLoading);