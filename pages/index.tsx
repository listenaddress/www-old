import Image from 'next/image'
import { parseContentForTable } from '@/lib/helpers'
import Popover from '@/components/popover'
import Navbar from '@/components/navbar'
import { useState, useEffect } from 'react'
import Link from 'next/link'


export default function Home() {
  const [hovering, setHovering] = useState({
    streamIndex: -1,
    contentIndex: -1,
  })
  const [streams, setStreams] = useState([])
  const fetchStreams = async () => {
    const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams')
    let streamsRes = await data.json()
    streamsRes = streamsRes.map((stream: any) => {
      stream.content = parseContentForTable(stream.content)
      return stream
    })
    setStreams(streamsRes)
  }
  // Fetch data api/streams
  useEffect(() => {
    fetchStreams()
  }, [])

  return (
    <>
      <Navbar />
      <main className="max-w-lg m-auto mt-28 px-4 text-black">
        {
          streams.map((stream: any, streamIndex: number) => {
            return (
              <Link href={`/stream/${stream.slug}`} key={streamIndex}>
                <div
                  className="flex flex-col justify-center p-6 px-[1.7rem] md:p-8 md:px-[2.3rem] border-2 rounded-xl border-[#EAEAEA] cursor-pointer"
                  key={streamIndex}>
                  <strong className="text-sm font-bold">
                    {stream.name}
                  </strong>
                  <p className="mt-2 text-sm">
                    {stream.about}
                  </p>
                  <p className={`mt-5 text-sm text-[#7B7B80]`}>
                    Recently in this stream
                  </p>
                  {/* Show first three pieces of content as three avatars next to each other (using content.platformImage) */}
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
                            <Image
                              src={content.platformImage}
                              alt=""
                              width={32}
                              height={32}
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
      </main>
    </>
  )
}
