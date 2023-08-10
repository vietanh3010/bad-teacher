import VideoGroupDisplay from "@/components/VideoGroupDisplay";
import useAgoraCall from "@/hooks/useAgoraCall";
import { ChannelFormType, ContracFormType, RoleEnum } from "@/types/types";
import useAppStore from "@/zustand/app.slice";
import { createMicrophoneAndCameraTracks } from "agora-rtc-react";
import dayjs from "dayjs";
import { memo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const QUERY_CHANNEL: Array<keyof ChannelFormType | 'exp'> = [
    'appId', 
    'channelName', 
    'token', 
    'exp', 
    'role',
]
const QUERIES_CONTRACT: Array<keyof ContracFormType > = [
    'customer_gender',
    'customer_fullname',
    'customer_phonenumber',
    'customer_id',
    'customer_dob',
    'customer_address',

    'insurance_product_name',
    'insurance_value',
    'insurance_time',
];

const PublicLink = (): JSX.Element => {
    const [searchParams] = useSearchParams();
    const [isQueryValid, setIsQueryValid] = useState<boolean>(false);
    const { setChannelInfo, setContractInfoFromObject } = useAppStore();
    const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks(undefined, {
        encoderConfig: {
            width: {max: 1080, min: 640},
            height: {max: 720, min: 480},
            frameRate: {max: 25, min: 15},
        },
        optimizationMode: 'detail'
    });
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const {start, setStart, isError} = useAgoraCall({tracks, ready});

    useEffect(() => {
        const isValid = [...QUERY_CHANNEL, ...QUERIES_CONTRACT].every(query => {
            const getParam = searchParams.getAll(query);
            if(query !== 'exp') {
                return getParam && getParam[0];
            }
            else {
                if(!getParam || !getParam[0]) return false;
                return dayjs(Number(getParam[0])).isValid() && dayjs(new Date().getTime()).isBefore(dayjs(Number(getParam[0])));
            }
        });
        if(isValid) {
            setChannelInfo({
                appId: decodeURIComponent(searchParams.getAll('appId')[0]),
                token: decodeURIComponent(searchParams.getAll('token')[0]),
                channelName: decodeURIComponent(searchParams.getAll('channelName')[0]),
                role: Number(decodeURIComponent(searchParams.getAll('role')[0])) as RoleEnum,
            })
            const contractInfoObj = QUERIES_CONTRACT.reduce<Record<keyof ContracFormType, string>>((p,c) => ({
                ...p,
                ...{[c]: `${ decodeURIComponent(searchParams.getAll(c)[0])}`}
            }),{} as Record<keyof ContracFormType, string>);
            setContractInfoFromObject(contractInfoObj);
        }
        setTimeout(() => {
            setIsQueryValid(!isValid)
        }, 500)
    }, [])

    return (
        <div className="h-full w-full">   
            {
                isQueryValid ?
                <span>Invalid link or link is expired</span>
                :
                <VideoGroupDisplay
                    ready={ready}
                    tracks={tracks}
                    setStart={setStart}
                    start={start}
                    isError={isError}
                    />
            }
        </div>
    )
}

export default memo(PublicLink);