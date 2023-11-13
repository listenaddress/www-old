import { useState, useEffect, useContext, useRef } from 'react';
import { parseContentForTable, getTime, extractDomainFromUrl } from '@/lib/helpers';
import { ArrowUpRightIcon, ChevronDownIcon, PencilSquareIcon, InformationCircleIcon, HandThumbDownIcon, HandThumbUpIcon, DocumentDuplicateIcon, QuestionMarkCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HandThumbDownIcon as HandThumbDownIconSolid, HandThumbUpIcon as HandThumbUpIconSolid, LinkIcon as LinkIconSolid, DocumentDuplicateIcon as DocumentDuplicateIconSolid, CogIcon, TrashIcon as TrashIconSolid } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router'
import { GlobalContext } from '@/context/store';
import Skeleton from 'react-loading-skeleton';
import Dropdown from '@/components/dropdown';
import FilterDropdown from '@/components/filterDropdown';
import 'react-loading-skeleton/dist/skeleton.css';
import Button from '@/components/button';
import Link from 'next/link';
import { Toaster, toast } from 'sonner'
import Popover from '@/components/popover'

const NUMBER_OF_OPTIONS = 2;

export default function Stream() {
    const [stream, setStream] = useState({ name: '', description: '', created_by: '', created_at: '', updated_at: '' })
    const [entries, setEntries] = useState<any[]>([])
    const [noResultsFound, setNoResultsFound] = useState(false)
    const [hoveringIndex, setHoveringIndex] = useState(-1)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [dragOverIndex, setDragOverIndex] = useState(-1)
    const [lastAction, setLastAction] = useState('')
    const [error, setError] = useState('')
    const [hoveringIndexMoreOptions, setHoveringIndexMoreOptions] = useState(-1)
    const [adminOptionsOpen, setAdminOptionsOpen] = useState(false)
    const [moreOptionsHover, setMoreOptionsHover] = useState(-1)
    const [textInput, setTextInput] = useState('')
    const router = useRouter()
    const { id } = router.query
    const { user } = useContext(GlobalContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const dropdownItems = []
    const inputRef = useRef(null);
    const firstEntryRef = useRef(null);
    // @ts-ignore
    if (user?.id && stream?.created_by === user.id) {
        dropdownItems.push({
            text: 'Edit stream',
            href: '/stream/' + id + '/edit',
            icon: PencilSquareIcon
        })
    }

    const onDragStart = (e: any, index: any) => {
        setSelectedIndex(index); // Mark the item as selected (being dragged)
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.innerHTML);
        e.dataTransfer.setDragImage(e.target, 20, 20); // Sets the position of the drag image relative to the mouse/touch event
    };

    const onDrop = async (e: any, index: any) => {
        e.preventDefault();

        const draggedIndex = selectedIndex;
        if (draggedIndex === -1 || draggedIndex === index) {
            return; // No item was dragged or it was dropped in its original position
        }

        // Update the entries state to reflect the new order
        const updatedEntries = [...entries];
        const item = updatedEntries[draggedIndex];
        updatedEntries.splice(draggedIndex, 1); // Remove the item from its original position
        updatedEntries.splice(index, 0, item); // Insert the item at the new position

        setEntries(updatedEntries);
        setSelectedIndex(-1); // Reset the selected index as the drop is completed
        setDragOverIndex(-1); // Reset the drag over index as the drop is completed

        // Call the move_entry endpoint
        let accessTokenFromCookie = ''
        if (document.cookie.split('accessToken=')[1]) {
            accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
        }
        const targetId = index === updatedEntries.length - 1 ? undefined : updatedEntries[index + 1].id;
        console.log("targetId", targetId)
        // Log the items we're moving in between
        console.log("Moving item", item.id, "to position", index, "in between", index === updatedEntries.length - 1 ? undefined : updatedEntries[index !== 0 ? index - 1 : 0].id, "and", targetId)
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'entry/' + item.id + '/move', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessTokenFromCookie
            },
            body: JSON.stringify({ target_id: targetId })
        });
        const data = await response.json();
        if (data.error) {
            toast.error(data.error);
        }
    };

    const onDragOver = (e: any, index: any) => {
        e.preventDefault();
        setDragOverIndex(index); // Mark the item as being hovered over
    };

    const formatAuthors = (authors: any[]) => {
        let result = "";
        authors.forEach((author, index) => {
            if (index < 2) {
                result += author.name;
                if (index !== authors.length - 1 && index !== 1) result += ', ';
            }

            if (index === 2 && authors.length > 3) {
                result += ', ' + authors[authors.length - 1].name;
                result += `, +${authors.length - 3}`
            } else if (index === 2 && authors.length === 3) {
                result += ', ' + authors[authors.length - 1].name;
            }
        });
        return result;
    }

    useEffect(() => {
        if (!id) return
        const fetchStream = async () => {
            let accessTokenFromCookie = ''
            if (document.cookie.split('accessToken=')[1]) {
                accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            }
            let data: any;
            if (accessTokenFromCookie !== '') {
                data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + id, {
                    'headers': {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessTokenFromCookie
                    }
                })
            } else data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + id)
            const streamRes = await data.json()
            if (streamRes.error && streamRes.error === 'Not authorized') {
                setError("This is a private stream. 🔒")
            } else {
                setStream(streamRes)
            }
        }

        const fetchStreamContent = async () => {
            let accessTokenFromCookie = ''
            if (document.cookie.split('accessToken=')[1]) {
                accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            }

            let data: any;
            if (accessTokenFromCookie !== '') {
                data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + id + '/content', {
                    'headers': {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessTokenFromCookie
                    }
                })
            } else data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + id + '/content')
            const contentRes = await data.json()
            if (contentRes.error && contentRes.error === 'Not authorized') {
                setError("This is a private stream. 🔒")
            } else {
                const entries = parseContentForTable(contentRes)
                setEntries(entries)
            }
        }

        fetchStream()
        fetchStreamContent()
    }, [id])

    useEffect(() => {
        // Check if the inputRef is defined before trying to focus
        if (inputRef && inputRef.current) {
            // @ts-ignore
            inputRef.current.focus();
        }
    }, [user, stream]);

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            addEntry();
        } else if ((e.key === 'Tab' || e.key === 'ArrowDown') && !e.shiftKey && entries.length > 0) {
            e.preventDefault();
            // @ts-ignore
            firstEntryRef.current?.focus();
            setSelectedIndex(0);
            setLastAction('select');
        }
    };

    const addEntry = async () => {
        let accessTokenFromCookie = ''
        if (document.cookie.split('accessToken=')[1]) {
            accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
        }

        let data: any;
        if (accessTokenFromCookie !== '') {
            data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'entry', {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                'method': 'POST',
                'body': JSON.stringify({
                    'url': textInput,
                    'stream_id': id
                })
            })
        } else {
            setError("You are not authorized. 🔒")
            return
        }
        const res = await data.json()
        if (res.error && res.error === 'Not authorized') {
            setError("You are not authorized. 🔒")
        } else {
            // Add to entries, parse them, set them
            const newEntries = parseContentForTable([res])
            setEntries([...newEntries, ...entries])
            setTextInput('')
        }
    }

    const deleteEntry = async (entryId: string, index: string) => {
        let accessTokenFromCookie = ''
        if (document.cookie.split('accessToken=')[1]) {
            accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
        }

        let data: any;
        if (accessTokenFromCookie !== '') {
            data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'entry/' + entryId, {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                'method': 'DELETE'
            })
        } else {
            setError("You are not authorized. 🔒")
            return
        }

        if (data.status === 204) {
            const newEntries = entries.filter((entry) => entry.id !== entryId)
            const entryDeleted = entries.find((entry) => entry.id === entryId)
            setEntries(newEntries)
            setHoveringIndexMoreOptions(-1)
            // @ts-ignore
            document.querySelector(`[data-entry-index="${index}"]`)?.focus();
        } setError("There was an issue deleting entry.")
    }

    return (
        <>
            <div className='m-4 mb-28 sm:ml-20'>
                <Toaster />
            </div>
            <div className='mt-6 px-4 max-w-[43rem] mx-auto'>
                <div className='flex justify-between items-center'>
                    <div className="flex items-center relative">
                        <h2 className="text-xl font-semibold">{stream.name}</h2>
                        {user && user.id === stream.created_by && (
                            <button
                                className="relative inline-block text-left"
                                onClick={() => {
                                    setDropdownOpen(!dropdownOpen)
                                }}
                            >
                                <ChevronDownIcon
                                    strokeWidth={2}
                                    // Make this bolder
                                    className="h-5 w-5 ml-2"
                                />
                                {dropdownOpen && (
                                    <Dropdown
                                        setIsOpen={() => setDropdownOpen}
                                        left="-.7" // Adjusted position for top bar
                                        top="1.3" // Adjusted position for top bar
                                        items={[
                                            {
                                                text: 'Edit',
                                                onClick: (e: any) => {
                                                    router.push(`/stream/${id}/edit`);
                                                    setDropdownOpen(false);
                                                },
                                                icon: PencilSquareIcon
                                            }
                                        ]}
                                    />
                                )}
                            </button>
                        )}

                    </div>
                    <button className="px-[12.5px] py-[6px] rounded-lg bg-gray-300 text-gray-900">
                        Filter
                    </button>
                </div>
                <div className='mt-9'>
                    {user && user.id === stream.created_by && (
                        <input
                            ref={inputRef}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md'
                            type='text'
                            placeholder='Add text or a link here'
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    )}
                </div>
                {
                    entries.length > 0 && (
                        <div className='mt-3'>
                            {
                                entries.map((item, index) => (
                                    <div className='relative' key={index}>
                                        {dragOverIndex === index && (
                                            <div
                                                style={{ height: '2px', backgroundColor: '#929295', position: 'absolute', top: 0, left: '-9px', width: 'calc(100% + 18px)' }}
                                                className='rounded-lg'
                                            >

                                            </div>
                                        )}
                                        <div
                                            draggable
                                            onDragStart={(e) => onDragStart(e, index)}
                                            onDrop={(e) => onDrop(e, index)}
                                            onDragOver={(e) => onDragOver(e, index)}
                                            ref={index === 0 ? firstEntryRef : null}
                                            tabIndex={0}
                                            className={`flex items-center h-[40px] mx-[-.75rem] py-9 px-[1.09rem] rounded-md ${selectedIndex === index ? 'z-10 bg-gray-300' : hoveringIndex === index ? 'bg-gray-200' : ''}`}
                                            style={navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') ? { outlineOffset: '-5px' } : {}}
                                            onMouseEnter={() => {
                                                setHoveringIndex(index)
                                                setHoveringIndexMoreOptions(-1)
                                                setLastAction('hover')
                                            }}
                                            onMouseLeave={() => setHoveringIndex(-1)}
                                            onClick={() => {
                                                setSelectedIndex(index)
                                                setLastAction('select')
                                            }}
                                            onKeyDown={(e) => {
                                                console.log("Handling keydown on entry", e.key)
                                                if (e.key === 'Backspace' || e.key === 'Delete') {
                                                    e.preventDefault();
                                                    deleteEntry(item.id, index.toString())
                                                    // setHoveringIndex(index + 1)
                                                }
                                                if (e.key === 'Tab') {
                                                    e.preventDefault();
                                                    let nextIndex = index + (e.shiftKey ? -1 : 1);
                                                    if ((hoveringIndexMoreOptions < NUMBER_OF_OPTIONS - 1) && !e.shiftKey) {
                                                        // Move focus to the next option within the same entry
                                                        setHoveringIndexMoreOptions(hoveringIndexMoreOptions + 1);
                                                        // @ts-ignore
                                                        document.querySelector(`[data-entry-index="${index}"][data-option-index="${hoveringIndexMoreOptions + 1}"]`)?.focus();
                                                    } else {
                                                        // Reset the options index and move focus to the next/previous entry
                                                        setHoveringIndexMoreOptions(-1);
                                                        setSelectedIndex(nextIndex);
                                                        setLastAction('select');

                                                        if (nextIndex < 0) {
                                                            // Focus on the input field if we're at the beginning
                                                            // @ts-ignore
                                                            inputRef.current?.focus();
                                                        } else if (nextIndex >= entries.length) {
                                                            // Loop back to the first entry if we're at the end
                                                            // @ts-ignore
                                                            firstEntryRef.current?.focus();
                                                        } else {
                                                            // Focus on the next/previous entry
                                                            // @ts-ignore
                                                            document.querySelector(`[data-entry-index="${nextIndex}"]`)?.focus();
                                                        }
                                                    }
                                                }
                                                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                                    e.preventDefault();
                                                    let nextIndex = index + (e.key === 'ArrowUp' ? -1 : 1);
                                                    setSelectedIndex(nextIndex);
                                                    setHoveringIndexMoreOptions(-1);
                                                    setLastAction('select');
                                                    if (nextIndex < 0) {
                                                        // @ts-ignore
                                                        inputRef.current?.focus();
                                                    } else if (nextIndex >= entries.length) {
                                                        // @ts-ignore
                                                        firstEntryRef.current?.focus();
                                                        setSelectedIndex(0);
                                                    } else {
                                                        // @ts-ignore
                                                        document.querySelector(`[data-entry-index="${nextIndex}"]`)?.focus();
                                                    }
                                                }
                                                if (e.key.toLowerCase() === 'c') {
                                                    navigator.clipboard.writeText(item.content.url)
                                                    toast.success('Copied url to clipboard.')
                                                }
                                            }}
                                            data-entry-index={index}
                                        >
                                            <div className='w-[40px] h-[40px] flex justify-center items-center'>
                                                <img
                                                    src={item.content.platformImage}
                                                    className='h-[42px] m-auto'
                                                />
                                            </div>
                                            <div
                                                style={{ maxWidth: 'calc(100% - 40px)' }}
                                                key="1"
                                                className='pt-[2px] pl-3'
                                            >
                                                <div className='text-gray-900 font-[500] overflow-ellipsis overflow-hidden whitespace-nowrap' style={{ lineHeight: '1.2', maxHeight: '20px' }} key="2">
                                                    {item.content.title} {item.id}
                                                </div>
                                                <div className='text-gray-500 mt-1 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap' style={{ maxHeight: '20px' }} key="3">
                                                    {item.content.authors && item.content.authors.length > 0 && formatAuthors(item.content.authors) + ' • '}
                                                    {
                                                        item.content.time && item.content.time
                                                    }
                                                    {
                                                        !item.content.time && (
                                                            <>
                                                                {/* Added {getTime(item.created_at)} */}
                                                                {extractDomainFromUrl(item.content.url)}
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            {
                                                (hoveringIndex === index || selectedIndex === index) && (
                                                    <div className={`absolute right-2 top-[14px] pl-4 ${selectedIndex === index ? 'bg-gray-300' : hoveringIndex === index ? 'bg-gray-200' : ''}`}>
                                                        <div className='flex items-center h-full'>
                                                            <div
                                                                onMouseEnter={() => {
                                                                    setHoveringIndexMoreOptions(0)
                                                                    setLastAction('hover')
                                                                }}
                                                                onMouseLeave={() => setHoveringIndexMoreOptions(-1)}
                                                                className='cursor-pointer'
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(item.content.url)
                                                                    toast.success('Copied url to clipboard.')
                                                                }}
                                                                tabIndex={0}
                                                                data-entry-index={index}
                                                                data-option-index={0}
                                                                onKeyDown={(e) => {
                                                                    e.preventDefault();
                                                                    if (e.key === 'Enter') {
                                                                        navigator.clipboard.writeText(item.content.url)
                                                                        toast.success('Copied url to clipboard.')
                                                                    }
                                                                }}
                                                            >
                                                                {
                                                                    (hoveringIndexMoreOptions === 0 && ((hoveringIndex === index && lastAction === 'hover') || (selectedIndex === index && (hoveringIndex < 0 || lastAction === 'select')))) ? (
                                                                        // true ? (
                                                                        <>
                                                                            <DocumentDuplicateIconSolid className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                                        </>
                                                                    ) : (
                                                                        <DocumentDuplicateIcon className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                                    )
                                                                }
                                                            </div>
                                                            {
                                                                (hoveringIndexMoreOptions === 0 && ((hoveringIndex === index && lastAction === 'hover') || (selectedIndex === index && (hoveringIndex < 0 || lastAction === 'select')))) && (
                                                                    <Popover
                                                                        text='Copy url'
                                                                        left="-22"
                                                                        bottom="-57"
                                                                        command="C"
                                                                    />
                                                                )
                                                            }
                                                            <div
                                                                onMouseEnter={() => {
                                                                    setHoveringIndexMoreOptions(1)
                                                                    setLastAction('hover')
                                                                }}
                                                                onMouseLeave={() => setHoveringIndexMoreOptions(-1)}
                                                                className='cursor-pointer'
                                                                onClick={() => {
                                                                    deleteEntry(item.id, index.toString())
                                                                }}
                                                                tabIndex={0}
                                                                data-entry-index={index}
                                                                data-option-index={1}
                                                                onKeyDown={(e) => {
                                                                    e.preventDefault();
                                                                    if (e.key === 'Enter') {
                                                                        deleteEntry(item.id, index.toString())
                                                                    }
                                                                    if (e.key === 'Tab') {
                                                                        let nextIndex
                                                                        nextIndex = index + (e.shiftKey ? -1 : 1);
                                                                        setSelectedIndex(nextIndex);
                                                                        setLastAction('select');
                                                                        if (!e.shiftKey) {
                                                                            // @ts-ignore
                                                                            document.querySelector(`[data-entry-index="${nextIndex}"]`)?.focus();
                                                                        } else {
                                                                            // @ts-ignore
                                                                            document.querySelector(`[data-entry-index="${index}"][data-option-index="0"]`)?.focus();
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {
                                                                    (hoveringIndexMoreOptions === 1 && ((hoveringIndex === index && lastAction === 'hover') || (selectedIndex === index && (hoveringIndex < 0 || lastAction === 'select')))) ? (
                                                                        <TrashIconSolid className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                                    ) : (
                                                                        <TrashIcon className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                                    )
                                                                }
                                                            </div>
                                                            {
                                                                (hoveringIndexMoreOptions === 1 && ((hoveringIndex === index && lastAction === 'hover') || (selectedIndex === index && (hoveringIndex < 0 || lastAction === 'select')))) && (
                                                                    <Popover
                                                                        text='Delete'
                                                                        left="2"
                                                                        bottom="-57"
                                                                        command="⌫"
                                                                    />
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )

                }
            </div>
        </>
    );
}
