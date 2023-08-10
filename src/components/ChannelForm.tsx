import useCustomTranslation from "@/hooks/useCustomTranslation";
import clsx from "clsx";
import _ from "lodash";
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from "primereact/inputtext";
import { memo, useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { CallTriggerPayload, ChannelFormType, ContracFormType, ContractTableType, RoleEnum } from "../types/types";
import useAppStore from "../zustand/app.slice";
import useTriggerStore from "@/zustand/trigger.slice";
type ChannelFormProps = {

}

const FORM_DEFINE: Array<keyof ChannelFormType> = [
    'appId', 
    'token', 
    'channelName', 
]

const CONTRACT_FORM: Array<keyof ContracFormType> = [
    'customer_gender',
    'customer_fullname',
    'customer_phonenumber',
    'customer_id',
    'customer_dob',
    'customer_address',

    'insurance_product_name',
    'insurance_value',
    'insurance_time',
]

const ChannelForm = ({
    
}: ChannelFormProps): JSX.Element => {
    const {T} = useCustomTranslation();
    const { handleSubmit, formState: { errors }, control, setValue } = useForm<ChannelFormType & ContracFormType>();
    const {setChannelInfo, setInCall, setContractInfo} = useAppStore();
    const { socket } = useTriggerStore();
    useEffect(() => {
        FORM_DEFINE.forEach(key => {
            setValue(key, localStorage.getItem(key) ?? '');
        })
        CONTRACT_FORM.forEach(key => {
            setValue(key, localStorage.getItem(key) ?? '');
        })
    }, [])
    
    
    const onSubmit = useCallback((data: ChannelFormType & ContracFormType) => {
        setInCall(true);
        setChannelInfo({
            ..._.pick(data, FORM_DEFINE),
            role: RoleEnum.Auditor,
        });
        const contractData = Object.entries(_.pick(data, CONTRACT_FORM)).map<ContractTableType>(([k,v]) => ({
            infoKey: k as keyof ContracFormType, 
            infoValue: v,
            isValidated: false,
        }));
        
        setContractInfo(contractData);
        FORM_DEFINE.forEach(key => {
            if(key in data) {
                localStorage.setItem(key, `${data[key]!}`);
            }
        });
        CONTRACT_FORM.forEach(key => {
            if(key in data) {
                localStorage.setItem(key, `${data[key]!}`);
            }
        });
        const payload: CallTriggerPayload = {
            ...data,
            status: 'join',
        }
        socket?.emit('message', payload)
    },[socket])

    const renderForm = (formDefine: (keyof ChannelFormType | keyof ContracFormType)[], required?: boolean) => {

        return (
            formDefine.map(key => 
                <div key={key} className="w-full relative">
                    <Controller
                        key={key}
                        name={key}
                        control={control}
                        rules={{ 
                            required: {
                                value: Boolean(required), 
                                message: `${key} is required`
                            }
                        }}
                        render={({ field }) => (
                            <span className="p-float-label p-input-filled z-20">
                                <InputText
                                    {...field}
                                    value={`${field.value}`}
                                    spellCheck={false}
                                    className={clsx("w-full p-inputtext-sm", errors[key] && "p-invalid")}
                                    id={key}/>
                                <label htmlFor={key}>{key}</label>
                            </span>
                        )}
                        />
                    
                    <span 
                        className={clsx("text-[12px] pl-2 text-danger-10 animate-fadedown transition-all absolute z-10 right-0", 
                            errors[key]?.message ? "top-[100%]": "top-0")}>
                        {`${errors[key]?.message ?? ""}`}
                    </span>
                </div>
            )
        )
    }

    return (
        <div className="w-full h-full lg:p-0 p-3 flex justify-center items-center">
            <Card 
                className="w-[90%] lg:w-2/3 max-h-[90vh] flex flex-col overflow-auto"
                title={T('info')}>
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-y-7 items-center m-0">

                    <div className="w-full font-medium text-base">{T('enterChannelInfo')}</div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-7 gap-x-2">{renderForm(FORM_DEFINE, true)}</div>

                    <div className="w-full font-medium text-base">{T('enterContractInfo')}</div>
                    <div  className="grid grid-cols-1 lg:grid-cols-3 gap-y-7 gap-x-2">{renderForm(CONTRACT_FORM)}</div>

                    <div className="flex space-x-2 justify-center">
                        <Button
                            size="small"
                            type="submit"
                            label={T('join')} />
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default memo(ChannelForm)