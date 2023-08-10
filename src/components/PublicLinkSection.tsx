import { RoleEnum } from "@/types/types";
import { memo, useRef } from "react"
import PublicLink from "./PublicLink";
import { Button } from "primereact/button";
import { OverlayPanel } from 'primereact/overlaypanel';

const LINK_ROLES: RoleEnum[] = [
    RoleEnum.Auditor,
    RoleEnum.Client
]

const PublicLinkSection = (): JSX.Element => {
    const refOverlay = useRef<OverlayPanel>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        refOverlay.current?.toggle(e)
    }

    const handleClose = () => {
        refOverlay.current?.hide()
    }

    return (
        <div className="flex space-x-2 items-center">
            <Button
                onClick={handleClick}
                rounded
                raised
                tooltip="share"
                tooltipOptions= {{
                    position: "top"
                }}
                icon="pi pi-link"
                />
            <OverlayPanel
                showCloseIcon
                ref={refOverlay}>
                <div className="flex flex-col space-y-3 lg:min-w-[320px]">
                    {
                        LINK_ROLES.map(role => 
                            <PublicLink
                                onSelect={handleClose}
                                role={role} 
                                key={role}/>
                        )
                    }
                </div>
            </OverlayPanel>
            
        </div>
    )
}

export default memo(PublicLinkSection);