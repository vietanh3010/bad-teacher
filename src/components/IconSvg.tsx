import clsx from "clsx";
import React from "react";
import { memo } from "react";
import SVG, { Props as SVGProps } from 'react-inlinesvg';

type IconSvgProps = Partial<SVGProps> & {
    name: string,
    usePresetClassname?: boolean,
}

function getPath(pathName: string) {
    return `${new URL(pathName, import.meta.url).href}`;
}
const Icon = React.forwardRef<SVGElement, SVGProps>((props, ref) => (
    <SVG innerRef={ref} {...props} />
));

const IconSvg = ({
    name,
    usePresetClassname,
    ...props
}: IconSvgProps): JSX.Element => {
    
    return (
        <>
            <Icon
                {...props}
                src={`${getPath(`../../icons/${name}.svg`)}`}
                className={clsx(props.className, usePresetClassname && `
                    [&_svg]:fill-[currentcolor] 
                    [&>rect]:stroke-[currentcolor] 
                    [&>circle]:stroke-[currentcolor] 
                    [&>line]:stroke-[currentcolor] 
                    [&>polygon]:stroke-[currentcolor] 
                    [&>polyline]:stroke-[currentcolor] 
                    [&>path]:fill-[currentcolor]
                    `
                )}
                />
        </>
    )
}

export default memo(IconSvg);