import AppConfig from "@/common/AppConfig";
import { BoxResponseType } from "@/types/types";
import useAppStore from "@/zustand/app.slice";
import useResizeObserver from "@react-hook/resize-observer";
import { ICameraVideoTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { memo, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { io } from "socket.io-client";

type VideoBoxCanvasProps = {
    userId: string | number,
    track: ICameraVideoTrack | IRemoteVideoTrack,
    videoRatio: number,
}

function getSize(el: HTMLDivElement, targetRatio: number) {
    const {width, height} = el.getBoundingClientRect();
    const ratio = width / height;
    if(ratio > targetRatio) {
        return {
            width: height * targetRatio,
            height: height
        }
    }
    else {
        return {
            width: width,
            height: width / targetRatio
        }
    }
}

const VideoBoxCanvas = ({
    userId,
    track,
    videoRatio
}: VideoBoxCanvasProps): JSX.Element => {
    const refCanvas = useRef<HTMLCanvasElement | null>(null);
    const refContainer = useRef<HTMLDivElement | null>(null);
    const { channelInfo, setNewContractCheckList } = useAppStore();
    const [socketMsg, setSocketMsg] = useState<string>('');
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const handleContractCheckList = (data: BoxResponseType) => {
        setNewContractCheckList(data.contract_check_list)
    }

    useEffect(() => {
        function onConnect() {
            console.log('connected');
          }
      
        function onDisconnect() {
            console.log('disconnected')
        }
        function onError(value: any) {
            console.log('error', value)
        }
        function onMessage(value: BoxResponseType) {
            console.log(value)
            if(Number(value.uid) !== Number(userId)) return;
            drawBox(value);
            handleContractCheckList(value);
            setSocketMsg(value.error);
        }
        console.log('trying to connect')
        const socket = io(`${AppConfig.BASE_SOCKET_URL}${AppConfig.OCR_NAMESPACE}`, {
            path: `${AppConfig.WS_PATH}${AppConfig.OCR_NAMESPACE}`,
            addTrailingSlash: false,
            port: AppConfig.WS_PORT,
            query: {
                appId: channelInfo.appId,
                channelName: channelInfo.channelName,
            },
        });
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('error', onError);
        socket.on('message', onMessage);
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('error', onError);
            socket.off('message', onMessage);
        }
    }, [channelInfo.appId, channelInfo.channelName, userId])

    const setSizeCanvas = useCallback(() => {
        if(!refContainer.current || !refCanvas.current) return;
        const {width, height} = getSize(refContainer.current, videoRatio);
        refCanvas.current.style.width = `${width}px`;
        refCanvas.current.style.height = `${height}px`;
        refCanvas.current.setAttribute('width', `${Math.round(width)}`);
        refCanvas.current.setAttribute('height', `${Math.round(height)}`);
        refCanvas.current.width = Math.round(width);
        refCanvas.current.height = Math.round(height);
        forceUpdate();
    }, [videoRatio])

    useResizeObserver(refContainer, () => {
        setSizeCanvas();
    })

    useEffect(() => {
        setSizeCanvas();
    }, [setSizeCanvas])
    
    
    const drawBox = useCallback((data: BoxResponseType) => {
        if(!refCanvas.current) return;
        setSizeCanvas();
        const boxCoord = data.box;
        const {width, height} = refCanvas.current.getBoundingClientRect();
        const ctx = refCanvas.current.getContext('2d');
        if(!ctx) return;
        if(
            boxCoord[0] === undefined ||
            boxCoord[1] === undefined ||
            boxCoord[2] === undefined ||
            boxCoord[3] === undefined
        ) {
            ctx.clearRect(0, 0, width, height);
            return;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        
        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round'
        // const LINE_LENGTH = 15;
        const w = Math.abs(boxCoord[2] - boxCoord[0]) * width;
        const h = Math.abs(boxCoord[3] - boxCoord[1]) * height
        // const corners = [
        //     [boxCoord[0] * width, boxCoord[1] * height],
        //     [boxCoord[0] * width + w, boxCoord[1] * height],
        //     [boxCoord[0] * width + w, boxCoord[1] * height + h],
        //     [boxCoord[0] * width, boxCoord[1] * height + h],
        // ];

        // corners.forEach((coord, i) => {
        //     ctx.moveTo(coord[0], coord[1] + LINE_LENGTH)
        //     ctx.lineTo(coord[0], coord[1])
        //     ctx.lineTo(coord[0] + LINE_LENGTH * (i %2 * 2 - 1), coord[1])
        // })
        
        ctx.rect(
            boxCoord[0] * width, 
            boxCoord[1] * height, 
            w, 
            h);
        ctx.stroke();
    }, [setSizeCanvas])

    return (
        <div
            ref={refContainer}
            className="absolute inset-0 w-full h-full flex justify-center items-center">
            <canvas
                ref={refCanvas}
                className="w-full h-full">
            </canvas>
            {
                socketMsg && 
                <span className="absolute top-1 mx-1 bg-gray-9/80 text-white/80 px-1 py-0.5 rounded-md select-none shadow text-center text-xs lg:text-sm border border-solid border-gray-4">
                    {socketMsg}
                </span>
            }
        </div>
    )
}

export default memo(VideoBoxCanvas)