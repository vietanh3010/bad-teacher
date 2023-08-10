import { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import { memo } from "react"
import VideoControl from "./VideoControl"
import VideoView from "./VideoView"
import Path from "@/utils/Path"
import IconSvg from "./IconSvg"
import CMessage from "./custom/CMessage"

type VideoGroupDisplayProps = {
    ready: boolean,
    tracks: [IMicrophoneAudioTrack, ICameraVideoTrack] | null,
    setStart: (start: boolean) => void,
    start: boolean,
    isError: boolean,
}

const VideoGroupDisplay = ({
    ready,
    tracks,
    setStart,
    start,
    isError,
}: VideoGroupDisplayProps): JSX.Element => {
    
    return (
        <div className="w-full h-full grow flex flex-col bg-gray-2 rounded-none lg:rounded-xl p-2 lg:p-5 space-y-5">
            <div className="w-full flex items-center justify-center">
                <IconSvg name="fpt_logo" className="h-10"/>
            </div>
            {
                isError ? 
                <CMessage
                    type="error"
                    text="Invalid info (token, appId,...) or token expired"/>
                :
                <>
                    {
                        (!ready || !tracks) && 
                        <CMessage
                            type="error"
                            text="No camera detected or camera is being used in another application"/>
                    }
                    {
                        start && tracks && 
                        <VideoView tracks={tracks} />
                    }
                    {  
                        ready && tracks && 
                        <VideoControl tracks={tracks} setStart={setStart}/>
                    }
                </>
            }
        </div>
    )
}

export default memo(VideoGroupDisplay)