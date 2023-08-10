import AgoraConfig from "@/common/AgoraConfig";
import { useEffect } from "react";
// import useAgoraAuth from "./useAgoraAuth";
import { AxiosInstance } from "axios";

type ResultAgoraHttpClient = {
    axiosInstance: AxiosInstance,
}
export default function useAgoraHttpClient(): ResultAgoraHttpClient {
    // const { authorizationField } = useAgoraAuth();
    const axiosInstance = AgoraConfig.createAxiosInstance();

    useEffect(() => {
        axiosInstance.interceptors.response.use(
            (response) => {
                return response.data;
            },
            (error) => {
                return Promise.reject(error);
            }
        )

        axiosInstance.interceptors.request.use(
            (config) => {
                // config.headers['Authorization'] = `${authorizationField}`;
                config.headers['Content-Type'] = 'application/json';
                config.headers['X-Request-ID'] = `${new Date().getTime()}`;
                return config;
            },
            (error) => {
                return Promise.reject(error);
            },
        )
    }, [])

    return {
        axiosInstance
    }
}