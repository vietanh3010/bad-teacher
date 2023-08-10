import useTriggerCall from "@/hooks/useTriggerCall";
import useAppStore from "@/zustand/app.slice";
import { memo } from "react";
import ChannelForm from "./ChannelForm";
import VideoViewContainer from "./VideoViewContainer";

const MainCall = (): JSX.Element => {
    const {isInCall, channelInfo} = useAppStore()
    const socket = useTriggerCall();

    return (
        <>
            {
                isInCall && channelInfo.appId && channelInfo.token ? 
                    <VideoViewContainer/>
                    : 
                    <ChannelForm/>
            }
        </>
    );
};

export default memo(MainCall);