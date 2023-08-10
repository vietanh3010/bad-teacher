import { RouteObject } from "react-router-dom";

export type ChannelFormType = {
    appId: string,
    token: string,
    channelName: string,
    role?: RoleEnum,
}

export enum RoleEnum {
    'Auditor' = 1001,
    'Client' = 1002,
    'Agent' = 1003,
    //
    'Contract' = 1004,
}


export type RouteExtends = Omit<RouteObject, 'children'> & {
    canGuard?: boolean,
    children?: RouteExtends[],
}

export type AudioSocketResponse = {
    type: "input" | "output",
    data: any[],
}

export type ContracFormType = {
    customer_gender: string,
    customer_fullname: string,
    customer_phonenumber: string,
    customer_id: string,
    customer_dob: string,
    customer_address: string,

    insurance_product_name: string,
    insurance_value: string,
    insurance_time: string,
}

export type BoxResponseType = {
    uid: string,
    status: string,
    error: string,
    box: [number, number, number, number],
    contract_check_list: Record<keyof ContracFormType, boolean>,
}


export type ContractTableType = {
    infoKey: keyof ContracFormType,
    infoValue: string,
    isValidated: boolean,
}

export type ChannelTriggerAction = 'join' | 'leave'

export type CallTriggerPayload = ChannelFormType & ContracFormType & {
    status: ChannelTriggerAction,
}