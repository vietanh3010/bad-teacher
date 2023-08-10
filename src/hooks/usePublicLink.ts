import { RoleEnum } from "@/types/types";
import useAppStore from "@/zustand/app.slice";
import dayjs from "dayjs";
import { useMemo } from "react";

const EXPIRE_MINUTE = 30;
type ResultPublicLink = string;

export default function usePublicLink(role: RoleEnum): ResultPublicLink {
    const { channelInfo, contractInfo } = useAppStore();
    const { appId, token, channelName } = channelInfo;

    const publicLink = useMemo(() => {
        const exp = dayjs(new Date()).add(EXPIRE_MINUTE, 'minute').toDate().getTime();
        const param = {
            appId,
            channelName,
            token: encodeURIComponent(`${token}`),
            role,
            exp,
            ...(contractInfo ?? []).reduce((p, c) => ({ ...p, ...{ [c.infoKey]: `${c.infoValue}` } }), {}),
        };
        const newQuery = Object.entries(param).map(([k, v]) => `${k}=${`${v}`}`).join('&');
        return encodeURI(`${window.location.origin}/public?${newQuery}`);
    }, [appId, channelName, token, role, contractInfo])

    return publicLink;
}