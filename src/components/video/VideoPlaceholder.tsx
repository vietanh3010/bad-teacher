import usePublicLink from "@/hooks/usePublicLink";
import { RoleEnum } from "@/types/types";
import Utils from "@/utils/Utils";
import useNotiStore from "@/zustand/noti.slice";
import useResizeObserver from '@react-hook/resize-observer';
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { memo, useCallback, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";

const QR_SIZE = 200;
type VideoPlaceholderProps = {
    role: RoleEnum,
}

const VideoPlaceholder = ({
    role
}: VideoPlaceholderProps): JSX.Element => {
    const publicLink = usePublicLink(role);
    const { setContent } = useNotiStore();
    const [isCopied, setCopied] = useState<boolean>(false);
    const [visible, setVisible] = useState(false);
    const refContainer = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState<number>(QR_SIZE);
    useResizeObserver(document.body, (entry) => {
        if(!refContainer.current) return;
        const {width, height} = refContainer.current.getBoundingClientRect();
        const newSize = Math.min(width, height);
        setSize(newSize)
    })
    const roleName = useMemo(() => {
        const roleNo = Number(role);
        return Utils.getRoleName(roleNo);
    }, [])

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(publicLink);
        setCopied(true);
        setContent({
            severity: 'success',
            summary: 'success',
            detail: `copied link for ${roleName} to clipboard`,
        })
        window.setTimeout(() => {
            setCopied(false);
        }, 2500)
    }, [publicLink])
    const renderQR = useCallback(() => {
        return (
            <QRCode 
                value={publicLink}
                size={size}
                className="h-auto max-w-full w-full"
                viewBox={`0 0 ${size} ${size}`}/>
        )
    }, [size, publicLink])

    return (
        <div className="p-3 bg-white rounded-md shadow-lg max-h-[90%] h-[90%] max-w-[90%] flex flex-col space-y-4 justify-center w-[80%] md:w-[40%]">
            <div className="flex flex-col justify-center items-center">
                <span className="font-medium text-sm text-primary text-center">Send invitation to </span>
                <a href={publicLink} className="text-secondary capitalize no-underline">{roleName}</a>
            </div>

            <div className="cursor-pointer h-full w-auto relative aspect-square lg:block hidden">
                <div 
                    ref={refContainer}
                    onClick={() => setVisible(true)}
                    className="w-full h-full absolute inset-0 flex justify-center">
                    <QRCode 
                        value={publicLink}
                        size={size}
                        className="h-full w-full"
                        viewBox={`0 0 ${size} ${size}`}/>
                </div>
                
            </div>
            <Dialog
                draggable={false}
                dismissableMask
                header="QR code" 
                visible={visible} 
                className="w-[80vw] lg:w-[50vw] max-h-[60vh]"
                onHide={() => setVisible(false)}>
                {renderQR()}
            </Dialog>
            <div className="flex lg:space-x-0 space-x-4 just justify-center items-center">
                <div className="flex flex-col items-center space-y-1 lg:hidden">
                    <Button
                        size="small"
                        raised
                        rounded
                        onClick={() => setVisible(true)}
                        icon="pi pi-qrcode"
                        severity={"secondary"}>
                    </Button>
                    <span className="text-center w-full text-xs">QR Code</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                    <Button
                        size="small"
                        raised
                        rounded
                        icon="pi pi-copy"
                        severity={isCopied ? "success" : "secondary"}
                        onClick={handleCopy}>
                    </Button>
                    <span className="text-center w-full text-xs">Copy link</span>
                </div>
            </div>
        </div>
    )
}

export default memo(VideoPlaceholder);