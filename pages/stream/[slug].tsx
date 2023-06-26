"use client";
import { useState, useEffect, useContext } from 'react'
import { parseContentForTable } from '@/lib/helpers';
import { ArrowUpRightIcon, SparklesIcon, EllipsisHorizontalIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon, HandThumbDownIcon as HandThumbDownSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image'
import Link from 'next/link'
import moment from 'moment'
import Popover from '@/components/popover';
import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router'
import Navbar from '@/components/navbar';

export default function Stream() {
    const [stream, setStream] = useState({ results: [] })
    const [moreOptionsHover, setMoreOptionsHover] = useState(-1)
    const [contentFeedback, setContentFeedback] = useState({})
    const router = useRouter()
    const { slug } = router.query

    useEffect(() => {
        if (!slug) return
        const fetchStream = async () => {
            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + slug)
            const streamRes = await data.json()
            if (!streamRes.results && typeof streamRes.results !== 'object') {
                return
            }
            streamRes.results = parseContentForTable(streamRes.results)
            setStream(streamRes)
        }

        // Todo: Remove this fetch
        const fetchStreamActions = async () => {
            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + slug + '/actions')
            const streamActionsRes = await data.json()
            if (!streamActionsRes.results && typeof streamActionsRes.results !== 'object') {
                return
            }
        }

        fetchStream()
        fetchStreamActions()
    }, [slug])

    type Feedback = {
        type: string;
    }

    type ContentFeedback = {
        [key: string]: Feedback;
    }

    const handleLikeClick = async (contentId: string) => {
        try {
            let optimisticNewContentFeedback: ContentFeedback = { ...contentFeedback }
            if (optimisticNewContentFeedback[contentId] && optimisticNewContentFeedback[contentId].type === 'dislike') {
                await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + slug + '/actions', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contentId
                    })
                })
            }

            optimisticNewContentFeedback[contentId] = { type: 'like' }
            setContentFeedback(optimisticNewContentFeedback)

            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + slug + '/actions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contentId,
                    type: 'like'
                })
            })
            await data.json()

        } catch (e) {
            console.error(e)
        }
    }

    const handleDislikeClick = async (contentId: string) => {
        try {
            let optimisticNewContentFeedback: ContentFeedback = { ...contentFeedback }
            if (optimisticNewContentFeedback[contentId] && optimisticNewContentFeedback[contentId].type === 'like') {
                await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + slug + '/actions', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contentId
                    })
                })
            }

            optimisticNewContentFeedback[contentId] = { type: 'dislike' }
            setContentFeedback(optimisticNewContentFeedback)

            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + slug + '/actions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contentId,
                    type: 'dislike'
                })
            })
            await data.json()
        } catch (e) {
            console.error(e)
        }
    }

    const handleUnlikeClick = async (contentId: string) => {
        try {
            let optimisticNewContentFeedback: ContentFeedback = { ...contentFeedback }
            delete optimisticNewContentFeedback[contentId]
            setContentFeedback(optimisticNewContentFeedback)

            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + slug + '/actions', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contentId
                })
            })
            await data.json()
        } catch (e) {
            console.error(e)
        }
    }

    const handleUndislikeClick = async (contentId: string) => {
        try {
            let optimisticNewContentFeedback: ContentFeedback = { ...contentFeedback }
            delete optimisticNewContentFeedback[contentId]
            setContentFeedback(optimisticNewContentFeedback)

            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + slug + '/actions', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contentId
                })
            })
            await data.json()
        } catch (e) {
            console.error(e)
        }
    }

    type PlatformToString = {
        [key: string]: string;
    }

    const platformToLabelString: PlatformToString = {
        substack: 'Article on Substack',
        spotify: 'Podcast on Spotify'
    }
    const platformToCTAString: PlatformToString = {
        substack: 'Read on Substack',
        spotify: 'Listen on Spotify'
    }

    return (
        <>
            <Navbar />
            <div className="max-w-[36rem] px-4 m-auto mt-28 mb-24 text-sm">
                {stream.results && stream.results.map((result: any, index: number) => {
                    const labelString = platformToLabelString[result.venue]
                    const createdAt = moment(result.createdAt);
                    const now = moment();
                    let date;
                    if (now.diff(createdAt, 'months') >= 5 && now.format('YYYY') !== createdAt.format('YYYY')) {
                        date = createdAt.format('YYYY')
                    } else if (now.diff(createdAt, 'weeks') >= 1) {
                        date = createdAt.format('MMMM D')
                    } else if (now.diff(createdAt, 'days') >= 1) {
                        if (now.diff(createdAt, 'days') == 1) {
                            date = 'Yesterday'
                        } else {
                            date = createdAt.format('dddd');
                        }
                    } else {
                        const duration = moment.duration(now.diff(createdAt));
                        if (duration.asHours() >= 1) {
                            date = Math.floor(duration.asHours()) + 'h ago';
                        } else if (duration.asMinutes() >= 1) {
                            date = Math.floor(duration.asMinutes()) + 'm ago';
                        } else {
                            date = Math.floor(duration.asSeconds()) + 's ago';
                        }
                        console.log(date);
                    }

                    const parseToArray = (summary: string) => {
                        const regex = /\d+\.\s(.*?)(?=\s\d+\.|$)/gs;
                        const result: string[] = [];

                        let match;
                        while ((match = regex.exec(summary)) !== null) {
                            if (match.index === regex.lastIndex) {
                                regex.lastIndex++;
                            }

                            match.forEach((match, groupIndex) => {
                                if (groupIndex === 1) { // We only want the captured group (the actual list item text)
                                    result.push(match);
                                }
                            });
                        }

                        if (result.length === 0) {
                            throw new Error('Unable to parse the summary');
                        }

                        return result;
                    }

                    try {
                        result.summaryArray = parseToArray(result.summary);
                    } catch (e) {
                        console.error(e);
                    }

                    return (
                        <div className="mt-6" key={index}>
                            <div>
                                <Link href={result.url}>
                                    <Image
                                        src={result.platformImage}
                                        alt={result.title}
                                        width={24}
                                        height={24}
                                        className='inline-block relative bottom-[2px] mr-2'
                                    />
                                    <p className={`inline-block`}>
                                        {labelString}
                                    </p>
                                    <p className='inline-block ml-2 text-gray-500'>
                                        ·
                                    </p>
                                    <p className='inline-block ml-2 text-gray-500'>
                                        {date}
                                    </p>
                                </Link>
                            </div>
                            <Link href={result.url}>
                                <h1 className='text-xl md:text-2xl font-bold mt-3'>
                                    {result.title}
                                </h1>
                            </Link>
                            <p className='mt-2 mb-4 text-gray-600'>
                                By {result.authors}
                            </p>
                            <div className='my-4 bg-gray-200 rounded-xl'>
                                <div className='p-6 pb-7'>
                                    <div className='mb-2'>
                                        <SparklesIcon width={22} strokeWidth={2} className='inline-block relative bottom-[2px] mr-2' />
                                        <p className='inline-block font-[600]'>
                                            Summary
                                        </p>
                                    </div>
                                    {result.summaryArray && result.summaryArray.map((summary: string, index: number) => {
                                        return (
                                            <div className="relative px-[2.65rem] pr-[1rem]" key={index}>
                                                <span className='text-bold text-2xl absolute left-[1.9rem] top-[-5px]'>·</span>
                                                <span key={index}>
                                                    {summary}
                                                    <br />
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='my-4'>
                                <Link href={result.url} className='text-blue-500 cursor-pointer'>
                                    <ArrowUpRightIcon width={18} strokeWidth={2} className='inline-block relative bottom-[2px] mr-2' />
                                    {platformToCTAString[result.venue]}
                                </Link>
                            </div>
                            <div className='my-4 relative w-auto'>
                                <div
                                    className='text-blue-500 cursor-default'
                                >
                                    <span
                                        onMouseOver={() => setMoreOptionsHover(index)}
                                        onMouseLeave={() => setMoreOptionsHover(-1)}>
                                        <EllipsisHorizontalIcon width={18} strokeWidth={2} className='inline-block relative bottom-[2px] mr-2' />
                                        More options
                                    </span>
                                </div>
                                {moreOptionsHover === index && (
                                    <Popover
                                        text='Coming soon'
                                        left={'0'}
                                        bottom={'30'}
                                    />
                                )}
                            </div>
                            <div className='my-4'>
                                {
                                    // @ts-ignore
                                    contentFeedback[result._id] && contentFeedback[result._id].type === 'like' ? (
                                        <div
                                            className='border-2 border-gray-200 rounded-[8px] pr-3 pl-[.74rem] pt-[.845rem] pb-[.645rem] inline-block cursor-pointer'
                                            onClick={() => handleUnlikeClick(result._id)}
                                        >
                                            <HandThumbUpSolidIcon width={24} strokeWidth={2} className='inline-block relative bottom-[2px]' />
                                        </div>
                                    ) : (
                                        <div
                                            className='border-2 border-gray-200 rounded-[8px] pr-3 pl-[.74rem] pt-[.845rem] pb-[.645rem] inline-block cursor-pointer'
                                            onClick={() => handleLikeClick(result._id)}
                                        >
                                            <HandThumbUpIcon width={24} strokeWidth={2} className='inline-block relative bottom-[2px]' />
                                        </div>
                                    )
                                }
                                {
                                    // @ts-ignore
                                    contentFeedback[result._id] && contentFeedback[result._id].type === 'dislike' ? (
                                        <div
                                            className='border-2 border-gray-200 rounded-[8px] pr-3 pl-[.74rem] pt-[.845rem] pb-[.645rem] inline-block cursor-pointer ml-4'
                                            onClick={() => handleUndislikeClick(result._id)}
                                        >
                                            <HandThumbDownSolidIcon width={24} strokeWidth={2} className='inline-block relative bottom-[2px]' />
                                        </div>
                                    ) : (
                                        <div
                                            className='border-2 border-gray-200 rounded-[8px] pr-3 pl-[.74rem] pt-[.845rem] pb-[.645rem] inline-block cursor-pointer ml-4'
                                            onClick={() => handleDislikeClick(result._id)}
                                        >
                                            <HandThumbDownIcon width={24} strokeWidth={2} className='inline-block relative bottom-[2px]' />
                                        </div>
                                    )
                                }
                            </div>
                            {
                                index !== stream.results.length - 1 && (
                                    <div className={`h-[2px] bg-gray-100 my-8`}></div>
                                )
                            }
                        </div>
                    )
                })}
            </div>
        </>
    );
}
