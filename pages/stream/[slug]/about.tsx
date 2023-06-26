"use client";
import { useState, useEffect, useContext } from 'react'
import { parseContentForTable } from '@/lib/helpers';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link'
import { ThemeContext } from '@/context/theme';
import { useRouter } from 'next/router'
import Navbar from '@/components/navbar';

export default function StreamAbout() {
    const [stream, setStream] = useState({ name: "", about: "", results: [] })
    const [moreOptionsHover, setMoreOptionsHover] = useState(-1)
    const [contentFeedback, setContentFeedback] = useState({})
    const router = useRouter()
    const { slug } = router.query
    useEffect(() => {
        if (!slug) return
        const fetchStream = async () => {
            const data = await fetch(window.location.origin + '/api/streams/' + slug)
            const streamRes = await data.json()
            if (!streamRes.results && typeof streamRes.results !== 'object') {
                return
            }
            streamRes.results = parseContentForTable(streamRes.results)
            setStream(streamRes)
        }

        fetchStream()
    }, [slug])

    return (
        <>
            <Navbar />
            <div className="max-w-[36rem] px-4 m-auto mt-28 mb-24 text-sm">
                {stream && stream.name && (
                    <>
                        <h1 className="text-2xl font-bold">About this stream</h1>
                        <p className="mt-4">
                            {stream && stream.about}
                        </p>
                        <div>
                            <Link href={`/stream/${slug}`}>
                                <div className='text-blue-500 cursor-pointer mt-4'>
                                    <span className='inline-block'>
                                        <ArrowLeftIcon width={18} strokeWidth={2} className='inline-block relative bottom-[2px] mr-2' />
                                    </span>
                                    Back to stream
                                </div>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
