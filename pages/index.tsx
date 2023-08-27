import { parseContentForTable } from '@/lib/helpers'
import Popover from '@/components/popover'
import Button from '@/components/button'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import router from 'next/router'
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
          <div className='max-w-[500px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-28'>
            <div className='font-medium mb-4 text-gray-500'>
              All public streams
            </div>
            {
              streams.map((stream: any, streamIndex: number) => {
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
                      {/* Show first three pieces of content as three avatars next to each other (using content.platformImage) */}
                      <div className='flex mt-2'>
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
            <main className="max-w-[34rem] m-auto mt-16 px-4 text-black">
              <h1 className='text-3xl font-bold mb-8'>
                Podcasts, papers, books and blogs around any research topic.
              </h1>
              <div className='mb-16'>
                <Button onClick={signIn} variant='blue'>
                  Get started
                </Button>
                <Button onClick={signIn} secondary className='ml-4'>
                  Sign in
                </Button>
              </div>
              {
                !streams || streams.length === 0 && (
                  <>
                    <Skeleton
                      height={220}
                      className='mb-4'
                      style={{
                        borderRadius: '.75rem',
                      }}
                    />
                    <Skeleton
                      height={240}
                      className='mb-4'
                      style={{
                        borderRadius: '.75rem',
                      }}
                    />
                    <Skeleton
                      height={220}
                      className='mb-4'
                      style={{
                        borderRadius: '.75rem',
                      }}
                    />
                    <Skeleton
                      height={240}
                      className='mb-4'
                      style={{
                        borderRadius: '.75rem',
                      }}
                    />
                  </>
                )
              }
              <div className='font-medium mb-4 text-gray-500'>
                Pinned streams
              </div>
              {
                streams.map((stream: any, streamIndex: number) => {
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
                        {/* Show first three pieces of content as three avatars next to each other (using content.platformImage) */}
                        <div className='flex mt-2'>
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
            </main>
          </>
        )
      }
    </>
  )
}
