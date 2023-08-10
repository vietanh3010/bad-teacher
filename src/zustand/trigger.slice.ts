import { Socket } from "socket.io-client";
import { create } from "zustand";

type TriggerState = {
    socket: Socket | null
}

type TriggerAction = {
    setSocket: (socket: Socket | null) => void,
    reset: () => void
}

const initialState: TriggerState = {
    socket: null,
}
const useTriggerStore = create<TriggerState & TriggerAction>((set) => ({
    ...initialState,
    setSocket: (socket: Socket | null) => set(() => ({ socket })),
    reset: () => set(initialState),
}))

export default useTriggerStore;