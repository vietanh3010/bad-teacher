import { memo } from "react"

const CIRCLE_DEFINE = [
    {
        width: 331,
        height: 327,
        left: -113,
        top: -144,
        background: '#BDD7FF',
        blur: 195,
    },
    {
        width: 304,
        height: 300,
        left: 244,
        top: 441,
        background: '#B38EFF',
        blur: 215,
    },
    {
        width: 499,
        height: 493,
        left: -324,
        top: 608,
        background: '#FBF4BC',
        blur: 105,
    },
    {
        width: 1134,
        height: 1120,
        left: 738,
        top: -147,
        background: '#FFF8ED',
        blur: 250,
    },
    {
        width: 261,
        height: 258,
        left: 1052,
        top: 571,
        background: '#7939FF',
        blur: 250,
    },
    {
        width: 814,
        height: 804,
        left: 1192,
        top: -317,
        background: '#E4D8FF',
        blur: 180,
    }
]

const RELATIVE_WIDTH = 1920;
const RELATIVE_HEIGHT = 950;

const GradientBackground = (): JSX.Element => {

    return (
        <svg 
            className="absolute w-full h-full inset-0 pointer-events-none z-0" 
            width={window.innerWidth} 
            height={window.innerHeight}>
            {
                CIRCLE_DEFINE.map((item, i) => 
                    <ellipse
                        key={i}
                        className="absolute"
                        cx={`${(item.left / RELATIVE_WIDTH + item.width / RELATIVE_WIDTH / 2)  * 100}%`}
                        cy={`${(item.top / RELATIVE_HEIGHT + item.height / RELATIVE_HEIGHT / 2)  * 100}%`}
                        rx={`${item.width / RELATIVE_WIDTH / 2 * 100}%`}
                        ry={`${item.height / RELATIVE_HEIGHT / 2 * 100}%`}
                        style={{
                            fill: item.background,
                            filter: `blur(${item.blur / RELATIVE_WIDTH * window.innerWidth}px)`,
                        }}>
                    </ellipse>
                )
            }
        </svg>
    )
}

export default memo(GradientBackground);