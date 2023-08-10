import Utils from "@/utils/Utils";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { IAgoraRTCRemoteUser, ICameraVideoTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import clsx from "clsx";
import { Avatar } from 'primereact/avatar';
import { memo, useEffect, useMemo, useRef, useState } from "react";
import VideoBoxCanvas from "./VideoBoxCanvas";
import VideoUserLabel from "./VideoUserLabel";
import VideoPlaceholder from "./VideoPlaceholder";
import { RoleEnum } from "@/types/types";
type VideoPlayerProps = {
    track?: ICameraVideoTrack | IRemoteVideoTrack;
    users?: IAgoraRTCRemoteUser[];
    remoteUser?: IAgoraRTCRemoteUser,
    userId?: string | number,
    mirror?: boolean,
}
const VideoPlayer = ({
    track,
    users,
    userId = '',
    remoteUser,
    mirror,
}: VideoPlayerProps): JSX.Element => {
    const refVideo = useRef<HTMLDivElement | null>(null);
    const [videoRatio, setVideoRatio] = useState<number | null>(null);
    useEffect(() => {
        if(!refVideo.current || !track) return;
        const video = refVideo.current.querySelector('video') as HTMLVideoElement;
        if(!video) return;
        video.onloadedmetadata = (e) => {
            setVideoRatio(video.videoWidth / video.videoHeight);
        }
    }, [track])
    
    const roleName = useMemo(() => {
        const roleNo = Number(userId);
        return Utils.getRoleName(roleNo);
    }, [])

    return (
        <div className="w-full h-full relative" ref={refVideo}>  
            {
                track &&
                    <>
                        <AgoraVideoPlayer
                            className={clsx("z-10 [&_video]:!object-contain w-full h-full aspect-[4/3]", mirror && "scale-x-[-1]")}
                            videoTrack={track}/>
                        <div className="absolute h-full w-full inset-0 flex items-center justify-center">
                            {
                                videoRatio && 
                                <VideoBoxCanvas
                                    videoRatio={videoRatio}
                                    userId={userId}
                                    track={track}/>
                            }
                        </div>
                    </>
            }
            {
                remoteUser ?
                <>
                    {
                        !remoteUser?.hasVideo && 
                        <div className="bg-gray-7 w-full h-full absolute flex items-center justify-center">
                            <Avatar 
                                icon="pi pi-user" 
                                size="xlarge" 
                                shape="circle"/>
                        </div>
                    }
                </>
                :
                <>  
                    {
                        !track && 
                        <div 
                            className="bg-gray-8 w-full h-full relative flex items-center justify-center bg-gradient-to-br from-gray-6 to-gray-3">
                            <VideoPlaceholder role={userId as RoleEnum}/>
                        </div>
                    }
                </>
                
            }
            {
                (remoteUser || track) && 
                <div className="absolute bottom-1.5 left-1 px-1">
                    <VideoUserLabel 
                        label={roleName} 
                        remoteUser={remoteUser}/>
                </div>
            }
            
        </div>
    )
}

export default memo(VideoPlayer)