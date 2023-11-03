"use client";
import { useRef } from 'react';

interface PopoverProps {
    text: string;
    command?: string;
    left?: string;
    bottom?: string;
}

function Popover({
    text = "No text provided",
    command,
    left = String(-10 * (text.length > 70 ? 73 : text.length) / 4),
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
            <div className="py-1 rounded-md pr-3">
                <p className="block px-[.85rem] pr-[.5rem] py-[.65rem] text-sm font-medium inline-block">{text}</p>
                {command &&
                    <div className="rounded bg-gray-500 text-white px-[9px] py-[3px] ml-1 inline-block">
                        {command}
                    </div>
                }
            </div>
        </div>
    );
}

export default Popover;
