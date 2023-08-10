import { create } from "zustand";
import { ChannelFormType, ContracFormType, ContractTableType } from "../types/types";

type AppState = {
    channelInfo: ChannelFormType,
    isInCall: boolean,
    contractInfo: ContractTableType[] | null,
}

type AppAction = {
    setChannelInfo: (channelInfo: ChannelFormType) => void,
    setInCall: (isInCall: boolean) => void,
    setContractInfo: (contractInfo: ContractTableType[] | null) => void,
    setNewContractCheckList: (checkList: Record<keyof ContracFormType, boolean>) => void,
    setContractInfoFromObject: (contractInfoObject: Record<keyof ContracFormType, string>) => void,
}

const initialState: AppState = {
    channelInfo: {
        appId: '',
        token: '',
        channelName: '',
        role: undefined,
    },
    contractInfo: null,
    isInCall: false,
}
const useAppStore = create<AppState & AppAction>((set) => ({
    ...initialState,
    setChannelInfo: (channelInfo: ChannelFormType) => set(() => ({ channelInfo })),
    setInCall: (isInCall: boolean) => set(() => ({ isInCall })),
    setContractInfo: (contractInfo: ContractTableType[] | null) => set(() => ({ contractInfo })),
    setNewContractCheckList: (checkList: Record<keyof ContracFormType, boolean>) => set((s) => {
        const newContractInfo = s.contractInfo?.map(v => ({
            ...v,
            isValidated: checkList[v.infoKey]
        }))
        return { contractInfo: newContractInfo };
    }),
    setContractInfoFromObject: (contractInfoObject: Record<keyof ContracFormType, string>) => set((s) => {
        const newContractInfo = Object.entries(contractInfoObject).map<ContractTableType>(([k, v]) => ({
            infoKey: k as keyof ContracFormType,
            infoValue: v,
            isValidated: false,
        }))
        return { contractInfo: newContractInfo };
    }),
}))

export default useAppStore;