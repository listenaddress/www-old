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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Stream() {
    const [stream, setStream] = useState({ results: [] })
    const [moreOptionsHover, setMoreOptionsHover] = useState(-1)
    const [contentFeedback, setContentFeedback] = useState({})
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        if (!id) return
        const fetchStream = async () => {
            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + id)
            const streamRes = await data.json()
            if (!streamRes.results && typeof streamRes.results !== 'object') return
            streamRes.results = parseContentForTable(streamRes.results)
            console.log(streamRes)
            setStream(streamRes)
        }

        fetchStream()
    }, [id])

    return (
        <></>
    );
}
