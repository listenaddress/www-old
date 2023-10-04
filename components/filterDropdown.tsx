import React, { useEffect, useRef, useContext, useState } from 'react';
import { ThemeContext } from "@/context/theme";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CheckboxInput from './checkboxInput';
import { parseContentForTable } from '@/lib/helpers';
import { useDebounce } from 'use-debounce';

interface MultiSelectProps {
    items: string[];
    selectedItem: string | null;
    setSelectedItem: (item: string | null) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    items,
    selectedItem,
    setSelectedItem
}) => {
    return (
        <div className="flex space-x-2 ml-[-7px]">
            {items.map(item => (
                <div
                    key={item}
                    className={`p-2 rounded-md ${selectedItem === item ? 'bg-gray-200' : ''} focus:outline-none inline-block text-sm font-medium cursor-pointer`}
                    onClick={() => setSelectedItem(item === selectedItem ? null : item)}
                >
                    {item}
                </div>
            ))}
        </div>
    );
};

interface FilterDropdownProps {
    left?: string;
    top?: string;
    right?: string;
    setIsOpen: any;
    setNoResultsFound: any;
    setContent: any;
    streamId: any;
}

function FilterDropdown({
    left = '0',
    top = '.5',
    right = 'auto',
    setIsOpen,
    setNoResultsFound,
    setContent,
    streamId
}: FilterDropdownProps) {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { theme, _ } = useContext(ThemeContext) as any;
    const [filterForPodcasts, setFilterForPodcasts] = useState(false);
    const [filterForPapers, setFilterForPapers] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [filterForWebsites, setFilterForWebsites] = useState(false);
    const [hasFiltered, setHasFiltered] = useState(false);
    const [search, setSearch] = useState('');

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

    useEffect(() => {
        if (!hasFiltered && !filterForPodcasts && !filterForPapers && !filterForWebsites) return
        setHasFiltered(true);
        const fetchData = async () => {
            let types = [];
            console.log(filterForPodcasts, filterForPapers, filterForWebsites)
            if (filterForPodcasts) types.push('podcast_episode');
            if (filterForPapers) types.push('paper');
            if (filterForWebsites) types.push('url');

            const typeQuery = types.length > 0 ? `type=${types.join('&type=')}` : '';
            const endpoint = `streams/${streamId}/content?${typeQuery}`;

            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint);
            const data = await response.json();
            if (data.length === 0) {
                setContent([]);
                setNoResultsFound(true);
            }
            setContent(parseContentForTable(data));
        };
        fetchData();
    }, [filterForPodcasts, filterForPapers, filterForWebsites, streamId, setContent, hasFiltered, setNoResultsFound]);

    const [debouncedSearch] = useDebounce(search, 250);

    useEffect(() => {
        if (!debouncedSearch && !hasFiltered && !selectedType) return;
        setHasFiltered(true);
        const fetchData = async () => {
            let type = '';
            switch (selectedType) {
                case "Papers": type = "paper"; break;
                case "Podcasts": type = "podcast_episode"; break;
                case "Blogs": type = "blog_post"; break;
                case "Videos": type = "video"; break;
            }
            const typeQuery = type ? `type=${type}` : '';
            let endpoint = `streams/${streamId}/content?${typeQuery}`;
            if (debouncedSearch) endpoint += `&search=${debouncedSearch}`;
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint);
            const data = await response.json();
            if (data.length === 0) {
                setContent([]);
                setNoResultsFound(true);
            }
            setContent(parseContentForTable(data));
        };
        fetchData();
    }, [debouncedSearch, selectedType, streamId, setContent, setNoResultsFound, hasFiltered]);

    const classNames = `absolute z-10 mt-2 p-5 pb-3 pt-3 w-max rounded-md bg-white border-gray-200 border-2`
    const handleLinkClick = (e: any, href: string) => {
        e.preventDefault();
        setIsOpen(false);
        router.push(href);
    };

    let styles: any = {}
    if (right !== 'auto') styles['right'] = right
    else if (left !== 'auto') styles['left'] = left
    else if (top !== 'auto') styles['top'] = top
    return (
        <div
            ref={ref}
            className={classNames}
            style={styles}
        >
            <div className="py-[5px] rounded-md bg-white shadow-xs w-[19rem]">
                <div className="text-gray-500 text-sm mb-[3px] font-medium">
                    Type
                </div>
                <div className="flex items-center">
                    <MultiSelect
                        items={["Papers", "Podcasts", "Blogs", "Videos"]}
                        selectedItem={selectedType}
                        setSelectedItem={setSelectedType}
                    />
                </div>
                <div className='mb-1 mt-3'>
                    <div className="text-gray-500 text-sm mb-[9px] font-medium">
                        Text
                    </div>
                    <input
                        type='text'
                        className='p-2 w-full border rounded-md bg-gray-200 border-none pl-4 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:ring-0'
                        placeholder='Search...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default FilterDropdown;
