import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { create } from "zustand";

type CallState = {
    users: IAgoraRTCRemoteUser[],
    isStart: boolean,
    isUserInfoChanged: number,

}

type CallAction = {
    setUsers: (users: IAgoraRTCRemoteUser[]) => void,
    setUserPublished: (user: IAgoraRTCRemoteUser) => void,
    setUserUnpublished: (user: IAgoraRTCRemoteUser) => void,
    setUserLeave: (user: IAgoraRTCRemoteUser) => void,
    setStart: (isStart: boolean) => void,
    setUserInfoChanged: () => void,
    reset: () => void
}

const initialState: CallState = {
    users: [],
    isStart: false,
    isUserInfoChanged: 0
}
const useCallStore = create<CallState & CallAction>((set) => ({
    ...initialState,
    setUsers: (users: IAgoraRTCRemoteUser[]) => set(() => ({ users })),
    setUserPublished: (user: IAgoraRTCRemoteUser) => set((s) => ({
        users: [...s.users, user],
    })),
    setUserUnpublished: (user: IAgoraRTCRemoteUser) => set((s) => ({
        users: [...s.users.filter(u => u.uid !== user.uid), user],
    })),
    setUserLeave: (user: IAgoraRTCRemoteUser) => set((s) => ({
        users: s.users.filter(u => u.uid !== user.uid),
    })),
    setUserInfoChanged: () => set(() => ({ isUserInfoChanged: new Date().getTime() })),
    setStart: (isStart: boolean) => set(() => ({ isStart })),
    reset: () => set(initialState),
}))

export default useCallStore;