import useAgoraCall from "@/hooks/useAgoraCall";
import Path from "@/utils/Path";
import AgoraRTC, { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { memo, useEffect, useState } from "react";
import VideoGroupDisplay from "./VideoGroupDisplay";
import { createMicrophoneAndCameraTracks } from "agora-rtc-react";
type VideoViewContainerProps = {

}

const VideoViewContainer = ({

}: VideoViewContainerProps): JSX.Element => {
    const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks(undefined, {
        encoderConfig: {
            width: {max: 1080, min: 640},
            height: {max: 720, min: 480},
            frameRate: {max: 25, min: 15},
        },
        optimizationMode: 'detail'
    });
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const { start, setStart, isError} = useAgoraCall({tracks, ready});
    
    return (
        <div className="h-full w-full flex flex-col">
            <VideoGroupDisplay
                ready={ready}
                tracks={tracks}
                setStart={setStart}
                start={start}
                isError={isError}
                />
        </div>
    );
}

export default memo(VideoViewContainer)