"use client";
import { useState, useEffect, useContext } from 'react'
import { parseContentForTable } from '@/lib/helpers';
import { ArrowUpRightIcon, ChevronDownIcon, PencilSquareIcon, InformationCircleIcon, HandThumbDownIcon, HandThumbUpIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { HandThumbDownIcon as HandThumbDownIconSolid, HandThumbUpIcon as HandThumbUpIconSolid, LinkIcon as LinkIconSolid, DocumentDuplicateIcon as DocumentDuplicateIconSolid } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router'
import { GlobalContext } from '@/context/store';
import Skeleton from 'react-loading-skeleton';
import Dropdown from '@/components/dropdown';
import FilterDropdown from '@/components/filterDropdown';
import 'react-loading-skeleton/dist/skeleton.css';
import Button from '@/components/button';
import Link from 'next/link';
import { Toaster, toast } from 'sonner'

export default function Stream() {
    const [stream, setStream] = useState({ name: '', description: '', created_by: '', created_at: '', updated_at: '' })
    const [content, setContent] = useState([])
    const [hoveringIndex, setHoveringIndex] = useState(-1)
    const [hoveringIndexMoreOptions, setHoveringIndexMoreOptions] = useState(-1)
    const [moreOptionsHover, setMoreOptionsHover] = useState(-1)
    const [contentFeedback, setContentFeedback] = useState({})
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

    dropdownItems.push({
        text: 'Stream details',
        href: '/stream/' + id + '/details',
        icon: InformationCircleIcon
    })

    const formatAuthors = (authors: any[]) => {
        let result = "";
        authors.forEach((author, index) => {
            if (index < 4) {
                result += author.name;
                if (index !== authors.length - 1 && index !== 3) result += ', ';
            }

            if (index === 4 && authors.length > 5) {
                result += ', ' + authors[authors.length - 1].name;
                result += '... ';
            } else if (index === 4 && authors.length === 5) {
                result += ', ' + authors[authors.length - 1].name;
            }
        });
        return result;
    }

    const like = async (contentId: number) => {
        // @ts-ignore
        const title = getContentInStateFromId(contentId)?.title;
        if (isLiked(contentId)) {
            toast.promise(
                (async () => {
                    const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
                    // @ts-ignore
                    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'actions/' + contentFeedback[contentId].id, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessTokenFromCookie
                        }
                    });
                    if (response.status !== 204) {
                        throw new Error('Failed to unlike the content');
                    }
                    setContentFeedback(prevFeedback => {
                        const newFeedback = { ...prevFeedback };
                        // @ts-ignore
                        delete newFeedback[contentId];
                        return newFeedback;
                    });
                })(),
                {
                    loading: 'Unliking...',
                    success: `You unliked "${title}"`,
                    error: `Failed to unlike ${title}`
                }
            )
            return;
        }

        let error = `Failed to like ${title}`;
        toast.promise(
            (async () => {
                const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'actions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessTokenFromCookie
                    },
                    body: JSON.stringify({
                        action_type: "like",
                        content_id: contentId,
                        stream_id: id
                    })
                });

                if (response.status !== 201) {
                    throw new Error('Failed to like the content');
                }

                const data = await response.json();

                setContentFeedback(prevFeedback => {
                    console.log(prevFeedback)
                    console.log(contentId)
                    console.log(data)
                    return {
                        ...prevFeedback,
                        [contentId]: { action_type: 'like', id: data.id, content_id: contentId }
                    }
                })

                return data;
            })(),
            {
                loading: 'Liking...',
                success: `You liked "${title}"`,
                error: error
            }
        );
    }

    // @ts-ignore
    const getContentInStateFromId = (contentId: number) => content.find(content => content.id === contentId);
    const dislike = async (contentId: number) => {
        // @ts-ignore
        let title = getContentInStateFromId(contentId)?.title;
        const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
        if (isDisliked(contentId)) {
            toast.promise(
                (async () => {
                    // @ts-ignore
                    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'actions/' + contentFeedback[contentId].id, {
                        'method': 'DELETE',
                        'headers': {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessTokenFromCookie
                        }
                    });
                    if (response.status !== 204) {
                        throw new Error('Failed to remove the dislike');
                    }
                    setContentFeedback(prevFeedback => {
                        const newFeedback = { ...prevFeedback };
                        // @ts-ignore
                        delete newFeedback[contentId];
                        return newFeedback;
                    });
                })(),
                {
                    loading: 'Removing dislike...',
                    success: `You removed your dislike from "${title}"`,
                    error: `Failed to remove the dislike from ${title}`
                }
            )
            return;
        }
        // @ts-ignore
        let error = `Failed to dislike ${title}`;
        toast.promise(
            (async () => {
                const accessTokenFromCookie = document.cookie.split('accessToken=')[1]?.split(';')[0]
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'actions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessTokenFromCookie
                    },
                    body: JSON.stringify({
                        action_type: "dislike",
                        content_id: contentId,
                        stream_id: id
                    })
                });

                const data = await response.json();

                if (response.status !== 201) {
                    if (data.error) error = data.error;
                    throw new Error('Failed to dislike the content');
                }

                setContentFeedback(prevFeedback => ({
                    ...prevFeedback,
                    [contentId]: { action_type: 'dislike', id: data.id, content_id: contentId }
                }));

                return data;

            })(),
            {
                loading: 'Disliking...',
                success: `You disliked "${title}"`,
                error: error
            }
        );
    }

    // @ts-ignore
    const isLiked = (contentId: number) => contentFeedback[contentId]?.action_type === 'like';
    // @ts-ignore
    const isDisliked = (contentId: number) => contentFeedback[contentId]?.action_type === 'dislike';

    useEffect(() => {
        if (!id) return
        const fetchStream = async () => {
            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + id)
            const streamRes = await data.json()
            console.log(streamRes)
            setStream(streamRes)
        }

        const fetchStreamContent = async () => {
            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + id + '/content')
            const contentRes = await data.json()
            const parsedContent = parseContentForTable(contentRes)
            // @ts-ignore
            setContent(parsedContent)
        }

        const fetchContentFeedback = async () => {
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1]?.split(';')[0]
            if (!accessTokenFromCookie) return
            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'actions?stream_id=' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + document.cookie.split('accessToken=')[1].split(';')[0]
                }
            })
            const contentFeedbackRes = await data.json()
            console.log(contentFeedbackRes)
            const contentFeedbackMap = {}
            contentFeedbackRes.forEach((feedback: any) => {
                // @ts-ignore
                contentFeedbackMap[feedback.content_id] = feedback
            })
            console.log(contentFeedbackMap)
            setContentFeedback(contentFeedbackMap)
        }

        fetchStream()
        fetchStreamContent()
        fetchContentFeedback()
    }, [id])

    return (
        <>
            <div className='m-4 mb-8 sm:ml-20'>
                <Toaster />
                <div className={`text-lg`}>
                    <div className={`items-center cursor-pointer inline-block mt-[3px]`}>
                        <div onClick={() => setDropdownOpen(!dropdownOpen)} className={`cursor-pointer`}>
                            <span className='font-medium'>{stream?.name}</span>
                            <ChevronDownIcon className={`inline-block w-5 h-5 ml-[.15rem]`} />
                            <div className='relative inline-block'>{dropdownOpen && <Dropdown left={'-2.3'} items={dropdownItems} setIsOpen={() => setDropdownOpen} />}</div>
                        </div>
                    </div>
                    <div className={`ml-auto inline-block float-right`}>
                        {!user && (
                            <Button size="sm" secondary className='mr-4' onClick={() => router.push('/sign-in')}>
                                Sign in
                            </Button>
                        )}
                        <Button
                            size="sm"
                            secondary
                            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                        >
                            Filter
                        </Button>
                        {
                            filterDropdownOpen && (
                                <FilterDropdown
                                    right={'1rem'}
                                    setIsOpen={() => setFilterDropdownOpen}
                                    setContent={setContent}
                                    streamId={id}
                                />
                            )
                        }
                    </div>
                </div>
                <div className={`mt-8 pb-2 border-b-2 border-gray-100 text-gray-500 text-[13px]`}>
                    <div className='flex items-center'>
                        <div className='inline-block w-1/5 sm:w-[8%] lg:w-[22%] xl:w-[19%] pr-2]'>
                            From
                        </div>
                        <div className='inline-block w-5/6 sm:w-[42%] lg:w-[40%] xl:w-[42%]'>
                            Title
                        </div>
                        <div className='hidden sm:inline-block sm:w-[35%] lg:w-[28%] xl:w-[32%]'>
                            By
                        </div>
                        <div className='hidden sm:inline-block sm:w-[15%] lg:w-[15%] xl:w-[12%] text-right'>
                            Published
                        </div>
                    </div>
                </div>
                {
                    content.length === 0 ? (
                        <div>
                            <Skeleton count={1} style={{ height: '70px' }} />
                            <Skeleton count={1} style={{ height: '100px' }} />
                            <Skeleton count={2} style={{ height: '70px' }} />
                            <Skeleton count={1} style={{ height: '85px' }} />
                            <Skeleton count={2} style={{ height: '100px' }} />
                            <Skeleton count={1} style={{ height: '70px' }} />
                            <Skeleton count={1} style={{ height: '85px' }} />
                            <Skeleton count={2} style={{ height: '70px' }} />
                        </div>
                    ) : (
                        <div className='text-[13px]'>
                            {content.map((item: any, index: number) => (
                                <div
                                    className='relative hover:bg-gray-300 ml-[-1rem] pl-[1rem] mr-[-1rem] pr-[1rem] hover:mt-[-1px] hover:pt-[1px]'
                                    key={index}
                                    onMouseEnter={() => {
                                        setHoveringIndex(index)
                                        setHoveringIndexMoreOptions(-1)
                                    }}
                                    onMouseLeave={() => setHoveringIndex(-1)}
                                >
                                    <Link href={item.url}>
                                        <div className=''>
                                            <div key={index} className='flex items-start pb-5 pt-5 border-b-2 border-gray-100 hover:border-transparent min-h-[70px]'>
                                                <div className='inline-block w-1/5 sm:w-[8%] lg:w-[22%] xl:w-[19%] pr-2'>
                                                    <div className='rounded-full w-7 h-7 absolute'>
                                                        {
                                                            item.ico ? (
                                                                <img className='w-7 h-7 rounded-md' src={item.ico || '/platform-images/paper.png'} alt="/platform-images/paper.png" />
                                                            ) : (
                                                                <img className='w-7 h-7 rounded-md' src={item.platformImage || '/platform-images/paper.png'} alt="/platform-images/paper.png" />
                                                            )
                                                        }
                                                    </div>
                                                    <span className='hidden lg:inline-block bottom-[-4px] left-[40px] pr-[50px] relative'>
                                                        {item.venue}
                                                    </span>
                                                </div>
                                                <div className='inline-block w-5/6 sm:w-[42%] lg:w-[40%] xl:w-[42%] mt-[4px] pr-3'>
                                                    <div className=''>
                                                        {item.title}
                                                    </div>
                                                </div>
                                                <div className='hidden sm:inline-block sm:w-[35%] lg:w-[28%] xl:w-[32%] mt-[4px] pr-2'>
                                                    {formatAuthors(item.authors)}
                                                </div>
                                                <div className='hidden sm:inline-block sm:w-[15%] lg:w-[15%] xl:w-[12%] text-right'>
                                                    {item.time}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    {
                                        hoveringIndex === index && (
                                            <div className='absolute right-2 top-[14px] bg-gray-300 rounded-lg'>
                                                <div className='flex items-center h-full'>
                                                    <div
                                                        onMouseEnter={() => setHoveringIndexMoreOptions(0)}
                                                        onMouseLeave={() => setHoveringIndexMoreOptions(-1)}
                                                        className='cursor-pointer'
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(item.url)
                                                            toast.success('Copied url to clipboard.')
                                                        }}
                                                    >
                                                        {
                                                            hoveringIndexMoreOptions !== 0 ? (
                                                                <DocumentDuplicateIcon className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                            ) : (
                                                                <DocumentDuplicateIconSolid className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                            )
                                                        }
                                                    </div>
                                                    <div
                                                        onMouseEnter={() => setHoveringIndexMoreOptions(1)}
                                                        onMouseLeave={() => setHoveringIndexMoreOptions(-1)}
                                                        className='cursor-pointer'
                                                        onClick={() => like(item.id)}
                                                    >
                                                        {
                                                            hoveringIndexMoreOptions !== 1 && !isLiked(item.id) ? (
                                                                <HandThumbUpIcon className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                            ) : (
                                                                <HandThumbUpIconSolid className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                            )
                                                        }
                                                    </div>
                                                    <div
                                                        onMouseEnter={() => setHoveringIndexMoreOptions(2)}
                                                        onMouseLeave={() => setHoveringIndexMoreOptions(-1)}
                                                        className='cursor-pointer'
                                                        onClick={() => dislike(item.id)}
                                                    >
                                                        {
                                                            hoveringIndexMoreOptions !== 2 && !isDisliked(item.id) ? (
                                                                <HandThumbDownIcon className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                            ) : (
                                                                <HandThumbDownIconSolid className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
        </>
    );
}
