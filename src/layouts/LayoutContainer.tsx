import { memo } from "react";
import { useOutlet } from "react-router-dom";
import AnimatedContainer from "./AnimatedContainer";
import GradientBackground from "./GradientBackground";

const LayoutContainer = (): JSX.Element => {
    const outlet = useOutlet();

    return (
        <AnimatedContainer>
            <GradientBackground/>
            <div className="z-10 inset-0 fixed h-full w-full p-0 lg:p-3">
                {outlet}
            </div>
        </AnimatedContainer>
    )
}

export default memo(LayoutContainer)