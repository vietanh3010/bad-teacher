import AgoraRTC, { ClientConfig, createClient, IAgoraRTCClient } from "agora-rtc-react";


const config: ClientConfig = {
    mode: "live",
    codec: "h264",
};
AgoraRTC.setLogLevel(4);

const useClient = createClient(config);
const client = useClient();
client.setClientRole('host');
type ResultAgoraClient = {
    client: IAgoraRTCClient,
}
export default function useAgoraClient(): ResultAgoraClient {

    return {
        client,
    };
}