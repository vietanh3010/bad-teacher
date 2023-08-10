import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng"
import { memo, useEffect, useMemo } from "react"
import IconSvg from "../IconSvg"
import clsx from "clsx"
import useCallStore from "@/zustand/call.slice"
import { Button } from "primereact/button"

type VideoUserLabelProps = {
    label: string | number,
    remoteUser?: IAgoraRTCRemoteUser,
}
const VideoUserLabel = ({
    label,
    remoteUser
}: VideoUserLabelProps): JSX.Element => {
    const { isUserInfoChanged } = useCallStore();
    
    const hasAudio = useMemo(() => {
        return !remoteUser || remoteUser?.hasAudio;
    }, [remoteUser, remoteUser?.hasAudio, isUserInfoChanged])

    return (
        <div className="bg-neutral-400 px-2 py-0.5 rounded-xl flex items-center space-x-1 select-none shadow-xl">
            <IconSvg 
                name={hasAudio ? "mic" : "mic-off"} 
                className={clsx("w-4 h-4", hasAudio ? "text-primary" : "text-danger-7")}/>
            <span className="text-white text-sm">{label}</span>
        </div>
        // <Button
        //     text
        //     className="!bg-white !h-8"
        //     rounded
        //     size="small"
        //     raised>
        //     <div className="flex items-center space-x-2">
        //         <IconSvg 
        //             name={hasAudio ? "mic" : "mic-off"} 
        //             className={clsx("w-4 h-4", hasAudio ? "text-primary" : "text-danger-7")}/>
        //         <span className="text-sm">{label}</span>
        //     </div>
        // </Button>
    )
}

export default memo(VideoUserLabel)