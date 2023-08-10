import AgoraConfig from "@/common/AgoraConfig";
import useAgoraHttpClient from "@/hooks/useAgoraHttpClient";
import useAppStore from "@/zustand/app.slice";
import { useCallback } from "react";

type ResultMediaPullService = {
    create: () => Promise<any>,
}

export default function useMediaPullService(): ResultMediaPullService {
    const { channelInfo } = useAppStore();
    const { appId, channelName } = channelInfo;
    const { axiosInstance } = useAgoraHttpClient();

    const create = useCallback(() => {
        return axiosInstance.post(
            `${AgoraConfig.API_URL}/${AgoraConfig.REGION}/v1/projects/${appId}/cloud-player/players`,
            {
                "player": {
                    "audioOptions": {
                        "profile": 1
                    },
                    "videoOptions": {
                        "width": 1368,
                        "height": 720,
                        "frameRate": 15,
                        "bitrate": 400,
                        "codec": "VP9",
                        "gop": 30,
                        "fillMode": "fill"
                    },
                    "streamUrl": "https://i.imgur.com/Nn1dKGV.jpg",
                    "channelName": `${channelName}`,
                    "token": "ba8adaf203764863b42600d3bd7395b1",
                    "idleTimeout": 5,
                    "uid": 10001,
                    "playTs": Math.ceil(new Date().getTime() / 1000) + 3,
                    "name": "media_pull_cloud_player"
                }
            }
            // {
            //     "player": {
            //         "streamUrl": AgoraConfig.RTMP_URL,
            //         "channelName": "class32",
            //         "uid": 10001,
            //         "idleTimeout": 5,
            //         "playTs": Math.ceil(new Date().getTime() / 1000) + 3,
            //         "name": "media_pull_cloud_player"
            //     }
            // }
        )
    }, [appId, channelName])

    return {
        create
    }
}