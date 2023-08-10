import { IAgoraRTCRemoteUser, ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useCallback, useEffect, useState } from "react";
import useAgoraClient from "./useAgoraClient";
import useAppStore from "@/zustand/app.slice";
import useCallStore from "@/zustand/call.slice";

type AgoraCallProps = {
    tracks: [ILocalAudioTrack, ILocalVideoTrack] | null,
    ready: boolean,
}

type ResultAgoraCall = {
    start: boolean,
    setStart: (start: boolean) => void,
    isError: boolean,
}
export default function useAgoraCall({
    tracks,
    ready
}: AgoraCallProps): ResultAgoraCall {
    const [start, setStart] = useState<boolean>(false);
    const { users, setUserPublished, setUserUnpublished, setUserLeave, setUserInfoChanged } = useCallStore();
    const { channelInfo } = useAppStore();
    const { client } = useAgoraClient();
    const { appId, token, channelName, role } = channelInfo;
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        if (!appId || !token) return;
        // function to initialise the SDK
        async function init(name: string) {
            client.on("user-published", async (user, mediaType) => {
                console.log(user)
                await client.subscribe(user, mediaType);
                if (mediaType === "video") {
                    setUserPublished(user)
                }
                if (mediaType === "audio") {
                    user.audioTrack?.setVolume(100);
                    user.audioTrack?.play();
                }
                setUserInfoChanged();
            });
            client.on("user-unpublished", (user, type) => {
                if (type === "audio") {
                    user.audioTrack?.stop();
                }
                if (type === "video") {
                    setUserUnpublished(user);
                }
                setUserInfoChanged();
            });

            client.on("user-left", (user) => {
                // console.log("leaving", user);
                setUserLeave(user);
                setUserInfoChanged();
            });
            const res = await client.join(appId, name, token, role).catch(e => {
                if (e.code === 'CAN_NOT_GET_GATEWAY_SERVER') {
                    setIsError(true);
                }
            });
            if (tracks) {
                // await client.publish([tracks[0], tracks[1]]);
                await client.publish(tracks.filter(Boolean));
            }
            setStart(true);
        };

        if (ready && tracks) {
            //   console.log("init ready");
            init(channelName);
        }

    }, [channelName, client, ready, tracks, appId, token, role]);

    return {
        start,
        setStart,
        isError,
    }
}