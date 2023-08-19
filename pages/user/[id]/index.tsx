import { useContext, useEffect, useState } from 'react';
import Link from 'next/link'; // Assuming you are using Next.js
import { GlobalContext } from '@/context/store';
import Popover from '@/components/popover';
import { parseContentForTable } from '@/lib/helpers';


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
    useEffect(() => {
        fetchStreams()
    }, [])

    return (
        user && (
            <div className='max-w-[500px] mx-auto px-4 sm:px-6 lg:px-8 mt-10'>
                <div className='font-medium mb-4 text-gray-500'>
                    Your streams
                </div>
                {
                    streams && streams.length > 0 && streams.map((stream: any, streamIndex: number) => {
                        return (
                            <Link href={`/stream/${stream.id}`} key={streamIndex}>
                                <div
                                    className="flex flex-col justify-center mb-8 p-6 px-[1.7rem] md:p-8 md:px-[2.3rem] border-2 rounded-xl border-[#EAEAEA] cursor-pointer"
                                    key={streamIndex}>
                                    <strong className="font-bold">
                                        {stream.name}
                                    </strong>
                                    <p className="mt-2">
                                        {stream.about}
                                    </p>
                                    <p className={`mt-5 text-[#7B7B80]`}>
                                        Recently in this stream
                                    </p>
                                    <div className='flex mt-2'>
                                        {
                                            stream.content.map((content: any, contentIndex: number) => {
                                                const onHover = () => {
                                                    setHovering({ streamIndex, contentIndex })
                                                }

                                                return (
                                                    <div
                                                        className="relative inline-block mx-[-5px] border-2 rounded-full border-white"
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
                                                        <img
                                                            src={content.platformImage}
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '50%'
                                                            }}
                                                        />
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