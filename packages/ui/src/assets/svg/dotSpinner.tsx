import React from "react";

interface DotSpinnerProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    gap?: number;     // space between dots
    radius?: number;  // dot size
}

export function DotSpinner({
    color,
    className,
    gap = 6,
    radius = 3,
    ...props
    }: DotSpinnerProps) {
    // original layout math:
    // 4 → 12 → 20  ===> distance = 8
    // 8 = radius*2 + gap  → gap default = 2
    // we generalize it

    const x1 = radius + 1;                 // ≈ original 4
    const step = radius * 2 + gap;         // ≈ original 8
    const x2 = x1 + step;                  // ≈ 12
    const x3 = x2 + step;                  // ≈ 20
    const x4 = x3;                         // reset target

    return (
        <svg
        width="24"
        height="24"
        viewBox={`0 0 ${x3 + radius + 1} 24`}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill={color ?? "currentColor"}
        {...props}
        >
        {/* Dot 1 */}
        <circle cx={x1} cy="12" r="0">
            <animate
            begin="0;spinner_z0Or.end"
            attributeName="r"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`0;${radius}`}
            fill="freeze"
            />
            <animate
            begin="spinner_OLMs.end"
            attributeName="cx"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${x1};${x2}`}
            fill="freeze"
            />
            <animate
            begin="spinner_UHR2.end"
            attributeName="cx"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${x2};${x3}`}
            fill="freeze"
            />
            <animate
            id="spinner_lo66"
            begin="spinner_Aguh.end"
            attributeName="r"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${radius};0`}
            fill="freeze"
            />
            <animate
            id="spinner_z0Or"
            begin="spinner_lo66.end"
            attributeName="cx"
            dur="0.001s"
            values={`${x3};${x1}`}
            fill="freeze"
            />
        </circle>

        {/* Dot 2 */}
        <circle cx={x1} cy="12" r={radius}>
            <animate
            begin="0;spinner_z0Or.end"
            attributeName="cx"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${x1};${x2}`}
            fill="freeze"
            />
            <animate
            begin="spinner_OLMs.end"
            attributeName="cx"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${x2};${x3}`}
            fill="freeze"
            />
            <animate
            id="spinner_JsnR"
            begin="spinner_UHR2.end"
            attributeName="r"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${radius};0`}
            fill="freeze"
            />
            <animate
            id="spinner_Aguh"
            begin="spinner_JsnR.end"
            attributeName="cx"
            dur="0.001s"
            values={`${x3};${x1}`}
            fill="freeze"
            />
            <animate
            begin="spinner_Aguh.end"
            attributeName="r"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`0;${radius}`}
            fill="freeze"
            />
        </circle>

        {/* Dot 3 */}
        <circle cx={x2} cy="12" r={radius}>
            <animate
            begin="0;spinner_z0Or.end"
            attributeName="cx"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${x2};${x3}`}
            fill="freeze"
            />
            <animate
            id="spinner_hSjk"
            begin="spinner_OLMs.end"
            attributeName="r"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${radius};0`}
            fill="freeze"
            />
            <animate
            id="spinner_UHR2"
            begin="spinner_hSjk.end"
            attributeName="cx"
            dur="0.001s"
            values={`${x3};${x1}`}
            fill="freeze"
            />
            <animate
            begin="spinner_UHR2.end"
            attributeName="r"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`0;${radius}`}
            fill="freeze"
            />
            <animate
            begin="spinner_Aguh.end"
            attributeName="cx"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${x1};${x2}`}
            fill="freeze"
            />
        </circle>

        {/* Dot 4 */}
        <circle cx={x3} cy="12" r={radius}>
            <animate
            id="spinner_4v5M"
            begin="0;spinner_z0Or.end"
            attributeName="r"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${radius};0`}
            fill="freeze"
            />
            <animate
            id="spinner_OLMs"
            begin="spinner_4v5M.end"
            attributeName="cx"
            dur="0.001s"
            values={`${x3};${x1}`}
            fill="freeze"
            />
            <animate
            begin="spinner_OLMs.end"
            attributeName="r"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`0;${radius}`}
            fill="freeze"
            />
            <animate
            begin="spinner_UHR2.end"
            attributeName="cx"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${x1};${x2}`}
            fill="freeze"
            />
            <animate
            begin="spinner_Aguh.end"
            attributeName="cx"
            calcMode="spline"
            dur="0.5s"
            keySplines=".36,.6,.31,1"
            values={`${x2};${x3}`}
            fill="freeze"
            />
        </circle>
        </svg>
    );
}
