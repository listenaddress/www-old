import { parseContentForTable } from '@/lib/helpers'
import Popover from '@/components/popover'
import Button from '@/components/button'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import router from 'next/router'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import dynamic from 'next/dynamic'
import { GlobalContext } from '@/context/store';
import 'react-loading-skeleton/dist/skeleton.css'
import { DocumentIcon, GlobeAltIcon, BookOpenIcon, RssIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const { user, setUser, loadingUser } = useContext(GlobalContext);
  const [hovering, setHovering] = useState({
    streamIndex: -1,
    contentIndex: -1,
  })
  const [streams, setStreams] = useState([])
  const fetchStreams = async () => {
    const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/latest')
    const dataJson = await data.json()
    for (let i = 0; i < dataJson.length; i++) {
      const content = dataJson[i].content
      const parsedContent = parseContentForTable(content)
      dataJson[i].content = parsedContent
    }
    setStreams(dataJson)
  }
  const signIn = () => router.push('/sign-in')
  const CrispWithNoSSR = dynamic(
    () => import('../components/crisp'),
    { ssr: false }
  )

  const getContentImage = (content: any) => {
    if (content.platformImage) return content.platformImage
  }

  const getContentIcon = (content: any) => {
    console.log(content)
    if (content.type === 'paper') return <DocumentIcon className="h-[22px] text-gray-500" />
    if (content.type === 'podcast') return <RssIcon className="h-[22px] text-gray-500" />
    if (content.type === 'book') return <BookOpenIcon className="h-[22px] text-gray-500" />
    if (content.type === 'blog_post') {
      if (content.external_ids) {
        // for (id in content.externalIds) {
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
    <>
      <CrispWithNoSSR />
      {
        user && (
          <div className='max-w-[530px] mx-auto px-4 sm:px-6 lg:px-8 mt-28 mb-28'>
            <div className='font-medium mb-8 text-gray-500'>
              Recent public streams
            </div>
            {
              streams.map((stream: any, streamIndex: number) => {
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
      }
      {
        !loadingUser && !user && (
          <>
            <main className="max-w-[640px] m-auto text-black text-[17px]">
              <div className='mt-10'>
                <Button onClick={signIn}>
                  Sign in
                </Button>
              </div>
              {/* Add border bottom */}
              <div className='font-medium mb-3 text-gray-500 mt-32 pb-2'>
                Recent streams
              </div>
              {
                !streams || streams.length === 0 && (
                  <>
                    <Skeleton
                      height={88}
                      borderRadius={'3px'}
                    />
                    <Skeleton
                      height={88}
                      borderRadius={'3px'}
                    />
                    <Skeleton
                      height={88}
                      borderRadius={'3px'}
                    />
                    <Skeleton
                      height={88}
                      borderRadius={'3px'}
                    />
                    <Skeleton
                      height={88}
                      borderRadius={'3px'}
                    />
                  </>
                )
              }
              {
                streams.map((stream: any, streamIndex: number) => {
                  return (
                    <Link href={`/stream/${stream.id}`} key={streamIndex}>
                      <div
                        className={`mx-[-9px] pt-3 pb-3 cursor-pointer flex justify-between items-center hover:bg-gray-200 rounded-md`}
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
                                  // position: relative;
                                  // left: -5px;
                                  className="relative inline-block mx-[-5px] border-2 rounded-full border-[#FCFCFC] bg-white"
                                  key={contentIndex}
                                  onMouseEnter={onHover}
                                  onMouseLeave={() => setHovering({
                                    streamIndex: -1,
                                    contentIndex: -1,
                                  })}>
                                  {
                                    hovering.streamIndex === streamIndex && hovering.contentIndex === contentIndex &&
                                    <Popover
                                      left={String(-10 * (content.title.length > 70 ? 73 : content.title.length) / 2)}
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
            </main>
          </>
        )
      }
    </>
  )
}
