import axios, { AxiosInstance } from "axios";


export default class AgoraConfig {
    static RTMP_URL = `rtmp://103.176.146.113:1935/live/stream_haihh`;
    static REGION = `ap`;
    static API_URL = `https://api.agora.io`;

    static createAxiosInstance() {
        return axios.create({
            baseURL: this.API_URL
        });
    }
}