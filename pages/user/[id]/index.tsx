import { useContext, useEffect, useState } from 'react';
import Link from 'next/link'; // Assuming you are using Next.js
import { GlobalContext } from '@/context/store';
import Popover from '@/components/popover';
import { parseContentForTable } from '@/lib/helpers';
import { DocumentIcon, GlobeAltIcon, BookOpenIcon, RssIcon } from '@heroicons/react/24/outline'


export default function User() {
    const { user, setUser, loadingUser } = useContext(GlobalContext);
    const [streams, setStreams] = useState([])
    const [hovering, setHovering] = useState({ streamIndex: -1, contentIndex: -1 });
    const fetchStreams = async () => {
        const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
        const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/user', {
            headers: {
                'Authorization': `Bearer ${accessTokenFromCookie}`,
                'Content-Type': 'application/json'
            }
        })
        const dataJson = await data.json()
        for (let i = 0; i < dataJson.length; i++) {
            const content = dataJson[i].content
            const parsedContent = parseContentForTable(content)
            dataJson[i].content = parsedContent
        }
        setStreams(dataJson)
    }

    const getContentIcon = (content: any) => {
        console.log(content)
        if (content.type === 'paper') return <DocumentIcon className="h-[22px] text-gray-500" />
        if (content.type === 'podcast') return <RssIcon className="h-[22px] text-gray-500" />
        if (content.type === 'book') return <BookOpenIcon className="h-[22px] text-gray-500" />
        if (content.type === 'blog_post') {
            if (content.external_ids) {
                for (let i = 0; i < content.external_ids.length; i++) {
                    if (content.external_ids[i].venue.toLowerCase() === 'rss') {
                        return <RssIcon className="h-[22px] text-gray-500" />
                    }
                }
            }
        }
        return <GlobeAltIcon className="h-[22px] text-gray-500" />
    }

    useEffect(() => {
        fetchStreams()
    }, [])

    return (
        user && (
            <div className='max-w-[530px] mx-auto px-4 sm:px-6 lg:px-8 mt-28 mb-28'>
                <div className='font-medium mb-8 text-gray-500'>
                    Your streams {streams.length === 5 && '(your last 5, we\'ll show older ones soon)'}
                </div>
                {
                    streams && streams.length > 0 && streams.map((stream: any, streamIndex: number) => {
                        return (
                            <Link href={`/stream/${stream.id}`} key={streamIndex}>
                                <div
                                    className={`mx-[-10px] pt-5 pb-5 border-t-2 border-gray-200 cursor-pointer flex justify-between items-center hover:bg-gray-200 ${streamIndex === streams.length - 1 ? 'border-b-2' : ''}`}
                                >
                                    <strong className="font-medium flex-grow px-[9.5px]">
                                        {stream.name}
                                    </strong>
                                    <div className='mt-[-2px] mr-[9px] flex-none flex w-[82px]'>
                                        {
                                            stream.content.map((content: any, contentIndex: number) => {
                                                const onHover = () => {
                                                    setHovering({ streamIndex, contentIndex })
                                                }

                                                return (
                                                    <div
                                                        className="relative inline-block mx-[-5px] border-2 rounded-full border-white bg-white"
                                                        key={contentIndex}
                                                        onMouseEnter={onHover}
                                                        onMouseLeave={() => setHovering({
                                                            streamIndex: -1,
                                                            contentIndex: -1,
                                                        })}>
                                                        {
                                                            hovering.streamIndex === streamIndex && hovering.contentIndex === contentIndex &&
                                                            <Popover
                                                                text={content.title}
                                                            />
                                                        }
                                                        {
                                                            content.platformImage ? (
                                                                <img
                                                                    src={content.platformImage || ''}
                                                                    style={{
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        borderRadius: '50%',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className='flex justify-center items-center'
                                                                    style={{
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: '#EAEAEA',
                                                                    }}
                                                                >
                                                                    {getContentIcon(content)}
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        )
    );
}
