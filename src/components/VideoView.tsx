import useAgoraClient from "@/hooks/useAgoraClient";
import { RoleEnum } from "@/types/types";
import useAppStore from "@/zustand/app.slice";
import useCallStore from "@/zustand/call.slice";
import { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import clsx from "clsx";
import { memo, useCallback } from "react";
import ContractSection from "./contract/ContractSection";
import VideoPlayer from "./video/VideoPlayer";

type ViewItem = {
    role: RoleEnum,
}
const VIEW_DEFINE: ViewItem[] = [
    {
        role: RoleEnum.Auditor,
    },
    {
        role: RoleEnum.Agent,
    },
    {
        role: RoleEnum.Contract,
    },
    {
        role: RoleEnum.Client,
    }
]

type VideoViewProps = {
    tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}

const VideoView = ({
    tracks
}: VideoViewProps): JSX.Element => {
    const { client } = useAgoraClient();
    const { users } = useCallStore();
    const { channelInfo } = useAppStore();
    const { role } = channelInfo;

    const renderViewByRole = useCallback((viewItem: ViewItem) => {
        switch (viewItem.role) {
            case RoleEnum.Contract:
            case RoleEnum.Agent:
            case RoleEnum.Auditor: 
            case RoleEnum.Client: {
                if(role === viewItem.role) {
                    return (
                        <VideoPlayer 
                            track={tracks[1]} 
                            users={users}
                            userId={client.uid}
                            mirror={role !== RoleEnum.Agent}/>
                    )
                }
                const remoteUser = users.find(u => u.uid === viewItem.role);
                return (
                    <>
                        {
                            <VideoPlayer
                                userId={remoteUser?.uid || viewItem.role}
                                track={remoteUser?.videoTrack}
                                remoteUser={remoteUser}/>
                        }
                    </>
                )
            }
        }
    }, [users, client.uid])
    
    return (
        <div className="rounded grow relative">
            <div 
                style={{gridAutoRows: '1fr'}}
                className={clsx("grid grid-cols-2 gap-1 lg:gap-2 w-full h-full absolute inset-0")}>
            {
                VIEW_DEFINE
                .map((viewItem, i) => 
                    <div
                        style={{order: VIEW_DEFINE.findIndex(v => v.role === viewItem.role)}}
                        className={clsx("h-full max-h-[1/2] aspect-square w-full border border-gray-400 border-solid rounded-xl relative overflow-hidden",
                            viewItem.role === RoleEnum.Contract && "row-[7_/_span_2] lg:row-auto lg:col-start-auto col-start-1 lg:col-span-1 col-span-2",
                            viewItem.role === RoleEnum.Auditor && "col-span-2 lg:col-span-1 row-span-3 lg:row-span-1",
                            (viewItem.role === RoleEnum.Agent || viewItem.role === RoleEnum.Client) && "row-span-3 lg:row-span-1",
                        )}
                        key={viewItem.role}>
                        <div className="absolute inset-0 w-full h-full flex justify-center">
                            {renderViewByRole(viewItem)}
                        </div>
                    </div>
                )
            }
           
            </div>
        </div>
    )
}

export default memo(VideoView)