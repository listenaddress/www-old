"use client";
import { useState, useEffect, useContext } from 'react'
import { parseContentForTable } from '@/lib/helpers';
import { ArrowUpRightIcon, ChevronDownIcon, PencilSquareIcon, InformationCircleIcon, HandThumbDownIcon, HandThumbUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import { HandThumbDownIcon as HandThumbDownIconSolid, HandThumbUpIcon as HandThumbUpIconSolid, LinkIcon as LinkIconSolid } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router'
import { GlobalContext } from '@/context/store';
import Skeleton from 'react-loading-skeleton';
import Dropdown from '@/components/dropdown';
import 'react-loading-skeleton/dist/skeleton.css';
import Button from '@/components/button';
import Link from 'next/link';

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

                if (index !== authors.length - 1 && index !== 3) {
                    result += ', ';
                }
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
                <div className='mt-8 pb-3 border-b-2 text-gray-500 text-[13px]'>
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
                            Time
                        </div>
                    </div>
                </div>
                {
                    content.length === 0 ? (
                        <div className='mt-4'>
                            <Skeleton count={5} />
                        </div>
                    ) : (
                        <div className='text-[13px]'>
                            {content.map((item: any, index: number) => (
                                <div className='relative hover:bg-gray-300 ml-[-1rem] pl-[1rem] mr-[-1rem] pr-[1rem] hover:mt-[-1px] hover:pt-[1px]' key={index} onMouseEnter={() => setHoveringIndex(index)} onMouseLeave={() => setHoveringIndex(-1)}>
                                    <Link href={item.url}>
                                        <div className=''>
                                            <div key={index} className='flex items-start pb-5 pt-5 border-b-2 hover:border-transparent min-h-[70px]'>
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
                                            <div className='absolute right-0 top-[14px] bg-gray-300 rounded-lg'>
                                                <div className='flex items-center h-full'>
                                                    <div onMouseEnter={() => setHoveringIndexMoreOptions(0)} onMouseLeave={() => setHoveringIndexMoreOptions(-1)} className='cursor-pointer'>
                                                        <LinkIcon className={`w-10 h-10 pl-3 pr-2 pt-1 pb-1 ${hoveringIndexMoreOptions === 0 ? 'stroke-[2.3px]' : ''}`} />
                                                    </div>
                                                    <div onMouseEnter={() => setHoveringIndexMoreOptions(1)} onMouseLeave={() => setHoveringIndexMoreOptions(-1)} className='cursor-pointer'>
                                                        {
                                                            hoveringIndexMoreOptions !== 1 ? (
                                                                <HandThumbUpIcon className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                            ) : (
                                                                <HandThumbUpIconSolid className='w-10 h-10 pl-2 pr-2 pt-1 pb-1' />
                                                            )
                                                        }
                                                    </div>
                                                    <div onMouseEnter={() => setHoveringIndexMoreOptions(2)} onMouseLeave={() => setHoveringIndexMoreOptions(-1)} className='cursor-pointer'>
                                                        {
                                                            hoveringIndexMoreOptions !== 2 ? (
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
