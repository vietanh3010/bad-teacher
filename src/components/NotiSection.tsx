import { memo, useEffect, useRef } from "react"
import { Toast } from 'primereact/toast';
import useNotiStore from "@/zustand/noti.slice";

const NotiSection = ():JSX.Element => {
    const { content } = useNotiStore();
    const refToast = useRef<Toast>(null);

    useEffect(() => {
        if(!content || !refToast.current) return;
        refToast.current.show(content);
    }, [content])
    

    return (
        <Toast ref={refToast} />
    )
}

export default memo(NotiSection);