"use client";
import { useState, useEffect, useContext } from 'react'
import { parseContentForTable } from '@/lib/helpers';
import { ArrowUpRightIcon, ChevronDownIcon, PencilSquareIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router'
import { GlobalContext } from '@/context/store';
import Skeleton from 'react-loading-skeleton';
import Dropdown from '@/components/dropdown';
import 'react-loading-skeleton/dist/skeleton.css';
import Button from '@/components/button';

export default function Stream() {
    const [stream, setStream] = useState({ name: '', description: '', created_by: '', created_at: '', updated_at: '' })
    const [moreOptionsHover, setMoreOptionsHover] = useState(-1)
    const [contentFeedback, setContentFeedback] = useState({})
    const router = useRouter()
    const { id } = router.query
    const { user } = useContext(GlobalContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
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
            console.log(contentRes)
        }

        fetchStream()
        fetchStreamContent()
    }, [id])

    const getDropdownLeft = () => {
        const windowWidth = window.innerWidth
        if (windowWidth < 767) {
            return '0'
        } else {
            return '-2.3'
        }
    }


    return (
        <>
            <div className={`ml-20 mt-[15px] text-lg`}>
                <div className={`flex items-center cursor-pointer`}>
                    <div onClick={() => setDropdownOpen(!dropdownOpen)} className={`cursor-pointer`}>
                        {stream?.name}
                        <ChevronDownIcon className={`inline-block w-5 h-5 ml-2 font-bold`} />
                        <div className='relative inline-block'>{dropdownOpen && <Dropdown left={getDropdownLeft()} items={dropdownItems} setIsOpen={() => setDropdownOpen} />}</div>
                    </div>
                    <div className={`ml-auto pr-4`}>
                        <Button size="sm" secondary onClick={() => { }}>Filter</Button>
                    </div>
                </div>
            </div >
        </>
    );
}
