import React, { useEffect, useRef, useContext } from 'react';
import { ThemeContext } from "@/context/theme";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DropdownProps {
    items: any[];
    left?: string;
    top?: string;
    setIsOpen: any;
}

function Dropdown({
    items,
    left = '0',
    top = '1.25',
    setIsOpen
}: DropdownProps) {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { theme, _ } = useContext(ThemeContext) as any;

    useEffect(() => {
        const closeOnAnyClick = (e: any) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', closeOnAnyClick);
        return () => {
            document.removeEventListener('click', closeOnAnyClick);
        };
    }, [setIsOpen]);

    const classNames = `absolute z-10 mt-2 w-max rounded-md bg-white border-${theme}-border-primary border-2`
    const handleLinkClick = (e: any, href: string) => {
        e.preventDefault();
        setIsOpen(false);
        router.push(href);
    };

    return (
        <div
            ref={ref}
            className={classNames}
            style={{
                left: `${left}rem`,
                top: `${top}rem`
            }}
        >
            <div className="py-1 rounded-md bg-white shadow-xs">
                {items.map((item: any, index: number) => (
                    <div
                        key={index}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        className={`block px-4 pr-8 py-2 text-sm font-medium hover:bg-[#F2F2F6] cursor-pointer`}>
                        <item.icon strokeWidth={2} width={22} className="inline-block relative bottom-[2px] mr-1" />
                        {item.text}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dropdown;
