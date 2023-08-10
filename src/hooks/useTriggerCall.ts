import AppConfig from "@/common/AppConfig";
import useTriggerStore from "@/zustand/trigger.slice";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function useTriggerCall() {
    const { setSocket } = useTriggerStore();

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
        function onMessage(value: any) {
            console.log(value)
        }

        const socket = io(`${AppConfig.BASE_SOCKET_URL}${AppConfig.CALL_NAMESPACE}`, {
            path: `${AppConfig.WS_PATH}${AppConfig.CALL_NAMESPACE}`,
            port: AppConfig.WS_PORT,
        });

        socket.on('connect', onConnect);
        socket.on('message', onMessage);
        socket.on('disconnect', onDisconnect);
        socket.on('error', onError);
        setSocket(socket)
        return () => {
            socket.off('connect', onConnect);
            socket.off('message', onMessage);
            socket.off('disconnect', onDisconnect);
            socket.off('error', onError);
            setSocket(null);
        }
    }, [])
}