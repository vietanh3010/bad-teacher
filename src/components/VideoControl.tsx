import AgoraRTC, { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import clsx from "clsx";
import { Button, ButtonProps } from "primereact/button";
import { SplitButton, SplitButtonProps } from 'primereact/splitbutton';
import { memo, useCallback, useEffect, useState } from "react";
import useAgoraClient from "../hooks/useAgoraClient";
import useAppStore from "../zustand/app.slice";
import IconSvg from "./IconSvg";
import PublicLinkSection from "./PublicLinkSection";
import { CallTriggerPayload, ContracFormType, RoleEnum } from "@/types/types";
import useTriggerStore from "@/zustand/trigger.slice";
type VideoControlProps = {
    tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
    setStart: (start: boolean) => void;
}

type VideoControlButton = 
    ({type: 'button'} & ButtonProps) |
    ({type: 'splitButton'} & SplitButtonProps)

const VideoControl = ({
    tracks,
    setStart,
}: VideoControlProps): JSX.Element => {
    const {client} = useAgoraClient();
    const [listCam, setListCam] = useState<MediaDeviceInfo[]>([]);
    const [selectedCam, setSelectedCam] = useState<string | null>(null)
    const [trackState, setTrackState] = useState({ video: true, audio: true });
    const {setInCall, channelInfo, contractInfo} = useAppStore();
    const {socket} = useTriggerStore();
    useEffect(() => {
        AgoraRTC.getCameras().then(devices => {
            setListCam(devices)
        })
    }, [])

    const mute = async (type: "audio" | "video") => {
        if (type === "audio") {
            await tracks[0].setEnabled(!trackState.audio);
            setTrackState((ps) => {
            return { ...ps, audio: !ps.audio };
            });
        } else if (type === "video") {
            await tracks[1].setEnabled(!trackState.video);
            setTrackState((ps) => {
                return { ...ps, video: !ps.video };
            });
        }
    };
  
    const leaveChannel = async () => {
        await client.leave();
        client.removeAllListeners();
        // we close the tracks to perform cleanup
        tracks[0].close();
        tracks[1].close();
        setStart(false);
        setInCall(false);
    };

    const handleChangeCam = async (deviceId: string) => {
        if(!!tracks[1].setDevice) {
            setSelectedCam(deviceId);
            await tracks[1]?.setDevice(deviceId);
        }
    }

    const refreshTrigger = useCallback(() => {
        if(!socket || !channelInfo || !contractInfo) return;
        const contractInfoObject = contractInfo.reduce<ContracFormType>((p, c) => ({ ...p, ...{ [c.infoKey]: `${c.infoValue}` } }), {} as ContracFormType)
        const payload: CallTriggerPayload = {
            ...channelInfo,
            ...contractInfoObject,
            status: 'join',
        }
        socket.emit('message', payload)
        console.log(payload)
    }, [socket, channelInfo, contractInfo])

    const buttonDefine: VideoControlButton[] = [
        {
            type: 'button',
            tooltip: trackState.audio ? "muteAudio" : "unmuteAudio",
            icon: <IconSvg name={trackState.audio ? "mic" : "mic-off"} className="w-5 h-5"/>,
            onClick: () => mute("audio"),
            severity: trackState.audio ? "info" : "danger",
            text: true,
            className: "!bg-white",
            raised: true,
            rounded: true,
        },
        {
            type:  'splitButton',
            icon: <IconSvg name={trackState.video ? "video" : "video-off"} className="w-5 h-5"/>,
            onClick: () => mute("video"),
            severity: trackState.video ? "info" : "danger",
            text: true,
            rounded: true,
            className: "!bg-white",
            raised: true,
            buttonProps: {
                tooltip: trackState.video ? "muteVideo" : "unmuteVideo",
                tooltipOptions: {
                    position: 'top',
                },
            },
            menuButtonProps: {
                tooltip: 'more',
                tooltipOptions: {
                    position: 'top',
                },
            },
            model: listCam.map(device => ({
                label: device.label, 
                value: device.deviceId,
                className: clsx("flex items-center space-x-2", selectedCam === device.deviceId && "!bg-primary/10 child:!text-primary/90"),
                command: () => handleChangeCam(device.deviceId)
                // icon: <IconSvg name={"video"} className="w-4 h-4"/>
            }))
        },
        {
            type: 'button',
            // label: 'leave',
            icon: <IconSvg name={"phone"} className="w-5 h-5"/>,
            onClick: () => leaveChannel(),
            severity: "danger",
            raised: true,
            rounded: true,
            tooltip: "leaveCall",
            tooltipOptions: {
                position: 'top',
            },
        },
        {
            type: 'button',
            icon: <IconSvg name={"refresh-ccw"} className="w-5 h-5"/>,
            onClick: () => refreshTrigger(),
            text: true,
            className: "!bg-white",
            raised: true,
            rounded: true,
            tooltip: "refresh",
            severity: "info",
            tooltipOptions: {
                position: 'top',
            },
            hidden: channelInfo.role === RoleEnum.Client,
        },
    ]

    const renderByType = (btn: VideoControlButton) => {
        switch (btn.type) {
            case 'button': {
                return (
                    <Button
                        tooltipOptions={{
                            position: 'top'
                        }}
                        {...btn}
                        />
                )
            }
            case 'splitButton': {
                return (
                    <SplitButton
                        {...btn}
                        />
                )
            }
            default: {
                return <></>
            }
        }
    }

  
    return (
        <div className="w-full grid grid-cols-3 py-1 items-center">
            <div></div>
            <div className="w-full flex justify-center space-x-2">
                {
                    buttonDefine.map((btn, i) => 
                        <div key={i}>
                            {renderByType(btn)}
                        </div>
                    )
                }
            </div>
            <div className="flex justify-end">
                <PublicLinkSection/>
            </div>
        </div>
    );
  };


  export default memo(VideoControl)