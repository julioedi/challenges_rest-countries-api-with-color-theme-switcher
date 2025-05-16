import React from "react";

export default function () {
    const path = "M12 15.375L6 9.375L7.4 7.975L12 12.575L16.6 7.975L18 9.375L12 15.375Z";
    return (
        <svg

            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            className="close"
        >
            <path
                d={path}
                fill="currentcolor"
            />
        </svg>
    )
}