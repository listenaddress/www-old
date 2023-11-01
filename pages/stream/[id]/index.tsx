import { useState, useEffect, useContext } from 'react'
import { parseContentForTable, getTime, extractDomainFromUrl } from '@/lib/helpers';
import { ArrowUpRightIcon, ChevronDownIcon, PencilSquareIcon, InformationCircleIcon, HandThumbDownIcon, HandThumbUpIcon, DocumentDuplicateIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { HandThumbDownIcon as HandThumbDownIconSolid, HandThumbUpIcon as HandThumbUpIconSolid, LinkIcon as LinkIconSolid, DocumentDuplicateIcon as DocumentDuplicateIconSolid, CogIcon } from '@heroicons/react/24/solid';
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

export default function Stream() {
    const [stream, setStream] = useState({ name: '', description: '', created_by: '', created_at: '', updated_at: '' })
    const [entries, setEntries] = useState<any[]>([])
    const [noResultsFound, setNoResultsFound] = useState(false)
    const [hoveringIndex, setHoveringIndex] = useState(-1)
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
    // @ts-ignore
    if (user?.id && stream?.created_by === user.id) {
        dropdownItems.push({
            text: 'Edit stream',
            href: '/stream/' + id + '/edit',
            icon: PencilSquareIcon
        })
    }

    const formatAuthors = (authors: any[]) => {
        let result = "";
        authors.forEach((author, index) => {
            if (index < 2) {
                result += author.name;
                if (index !== authors.length - 1 && index !== 1) result += ', ';
            }

            if (index === 2 && authors.length > 3) {
                result += ', ' + authors[authors.length - 1].name;
                result += '... ';
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

    const callEndpoint = async () => {
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
                },
                'method': 'POST',
                'body': JSON.stringify({
                    'url': textInput
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

    return (
        <>
            <div className='m-4 mb-28 sm:ml-20'>
                <Toaster />
            </div>
            <div className='mt-6 px-4 max-w-2xl mx-auto'>
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
                            className='w-full px-3 py-2 border border-gray-300 rounded-md'
                            type='text'
                            placeholder='Enter text here'
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    callEndpoint();
                                }
                            }}
                        />
                    )}
                    {/* <div className='mt-4'>
                        <button
                            onClick={() => callEndpoint()}
                            className='px-4 py-2 rounded-md bg-gray-900 text-white'
                        >
                            Add
                        </button>
                    </div> */}
                </div>
                {
                    entries.length > 0 && (
                        <div className='mt-3'>
                            {
                                entries.map((entry, index) => (
                                    <div key={index} className='flex items-center h-[40px] mx-[-.75rem] py-9 px-[1.09rem] hover:bg-gray-300 rounded-md'>
                                        <div
                                            // style={{ width: '40px', height: '40px' }}
                                            className='w-[40px] h-[40px] rounded-md flex justify-center items-center'
                                        >
                                            <img
                                                src={entry.content.platformImage}
                                                className='rounded-md h-[42px] m-auto'
                                            />
                                        </div>
                                        <div
                                            style={{ maxWidth: 'calc(100% - 40px)' }}
                                            key="1"
                                            className='pt-[2px] pl-3'
                                        >
                                            <div className='text-gray-900 font-medium overflow-ellipsis overflow-hidden whitespace-nowrap' style={{ lineHeight: '1.2', maxHeight: '20px' }} key="2">
                                                {entry.content.title}
                                            </div>
                                            <div className='text-gray-500 mt-1 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap' style={{ maxHeight: '20px' }} key="3">
                                                {entry.content.authors && entry.content.authors.length > 0 && formatAuthors(entry.content.authors) + ' • '}
                                                {
                                                    entry.content.time && entry.content.time
                                                }
                                                {
                                                    !entry.content.time && (
                                                        <>
                                                            {/* Added {getTime(entry.created_at)} */}
                                                            {extractDomainFromUrl(entry.content.url)}
                                                        </>
                                                    )
                                                }
                                            </div>
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
