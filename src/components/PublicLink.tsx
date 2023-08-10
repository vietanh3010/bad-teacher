import usePublicLink from "@/hooks/usePublicLink";
import { RoleEnum } from "@/types/types";
import Utils from "@/utils/Utils";
import useNotiStore from "@/zustand/noti.slice";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { memo, useCallback, useMemo, useState } from "react";

type PublicLinkProps = {
    role: RoleEnum,
    onSelect?: () => void,
}

const PublicLink = ({
    role,
    onSelect
}: PublicLinkProps): JSX.Element => {
    const { setContent } = useNotiStore();
    const [isCopied, setCopied] = useState<boolean>(false);
    const publicLink = usePublicLink(role);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(publicLink);
        setCopied(true);
        setContent({
            severity: 'success',
            summary: 'success',
            detail: `copied link for ${roleName} to clipboard`,
        })
        onSelect && onSelect();
        window.setTimeout(() => {
            setCopied(false);
        }, 2500)
    }, [publicLink])

    const roleName = useMemo(() => {
        return Utils.getRoleName(role);
    }, [role])

    return (
        <div>
            <label htmlFor={`${roleName}`}>
                {roleName}
            </label>
            <div className="p-inputgroup">
                <InputText
                    id={`${roleName}`}
                    value={publicLink}
                    // placeholder={role}
                    className="p-inputtext-sm !bg-white" />
                <Button
                    onClick={handleCopy}
                    icon="pi pi-copy"
                    size="small"
                    severity={isCopied ? "success" : "info"}/>
            </div>
        </div>
    )
}

export default memo(PublicLink);