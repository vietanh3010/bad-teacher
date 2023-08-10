import { ToastMessage } from "primereact/toast";
import { create } from "zustand";

type NotiState = {
    content: ToastMessage | null
}

type NotiAction = {
    setContent: (content: ToastMessage | null) => void,
}

const initialState: NotiState = {
    content: null
}
const useNotiStore = create<NotiState & NotiAction>((set) => ({
    ...initialState,
    setContent: (content: ToastMessage | null) => set(() => ({ content })),
}))

export default useNotiStore;