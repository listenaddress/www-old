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
    const [content, setContent] = useState([])
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
            const parsedContent = parseContentForTable(contentRes)
            console.log(parsedContent)
            // @ts-ignore
            setContent(parsedContent)
        }

        fetchStream()
        fetchStreamContent()
    }, [id])

    return (
        <>
            <div className='m-4 mb-8 sm:ml-20'>
                <div className={`text-lg`}>
                    <div className={`items-center cursor-pointer inline-block mt-[3px]`}>
                        <div onClick={() => setDropdownOpen(!dropdownOpen)} className={`cursor-pointer`}>
                            <span className='font-medium'>{stream?.name}</span>
                            <ChevronDownIcon className={`inline-block w-5 h-5 ml-[.15rem]`} />
                            <div className='relative inline-block'>{dropdownOpen && <Dropdown left={'-2.3'} items={dropdownItems} setIsOpen={() => setDropdownOpen} />}</div>
                        </div>
                    </div>
                    <div className={`ml-auto inline-block float-right`}>
                        <Button size="sm" secondary className='mr-4' onClick={() => router.push('/sign-in')}>
                            Sign in
                        </Button>
                        <Button size="sm" secondary onClick={() => { }}>Filter</Button>
                    </div>
                </div>
                <div className='mt-8 pb-3 border-b-2 text-gray-500'>
                    <div className='flex items-center'>
                        <div className='inline-block w-1/5'>
                            From
                        </div>
                        <div className='inline-block w-4/5'>
                            Title
                        </div>
                    </div>
                </div>
                {
                    content.length === 0 ? (
                        <div className='mt-4'>
                            <Skeleton count={5} />
                        </div>
                    ) : (
                        <div className=''>
                            {content.map((item: any, index: number) => (
                                <div key={index} className='flex items-start pb-4 pt-4 border-b-2'>
                                    <div className='inline-block w-1/5'>
                                        <div className='rounded-full w-10 h-10'>
                                            <img className='w-10 h-10 rounded-full' src={item.platformImage || '/platform-images/paper.png'} />
                                        </div>
                                    </div>
                                    <div className='inline-block w-4/5 mt-[7px]'>
                                        <div className=''>
                                            {item.title}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
        </>
    );
}
