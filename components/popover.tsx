"use client";
import { useRef } from 'react';

interface PopoverProps {
    text: string;
    left?: string;
    bottom?: string;
}

function Popover({
    text,
    left = "-100",
    bottom = "36"
}: PopoverProps) {
    const ref = useRef<HTMLDivElement>(null);
    if (text.length > 70) {
        text = text.substring(0, 70) + "...";
    }

    const classNames = `absolute z-10 rounded-md bg-[#1B1B1D] text-white w-max`;
    return (
        <div
            className={classNames}
            ref={ref}
            style={{
                bottom: `${bottom}px`,
                left: `${left}px`
            }}
        >
            <div className="py-1 rounded-md">
                <p className="block px-4 py-2 text-sm font-medium">{text}</p>
            </div>
        </div>
    );
}

export default Popover;
