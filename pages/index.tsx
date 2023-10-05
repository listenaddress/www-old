import { parseContentForTable } from '@/lib/helpers'
import Popover from '@/components/popover'
import Button from '@/components/button'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import router from 'next/router'
// import Image from 'next/image'
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
          <div className='max-w-[530px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-28'>
            <div className='font-medium mb-4 text-gray-500'>
              All public streams
            </div>
            {
              streams.map((stream: any, streamIndex: number) => {
                return (
                  <Link href={`/stream/${stream.id}`} key={streamIndex}>
                    <div
                      className='flex flex-col justify-center mb-8 p-6 px-[1.7rem] md:p-8 md:px-[2.3rem] border-2 rounded-xl border-[#EAEAEA] cursor-pointer hover:bg-[#F7F7F7]'
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
            <main className="max-w-[640px] m-auto px-4 text-black">
              <div className="font-medium mt-14 mb-24">Streams</div>
              <h1 className='md:text-[45px] md:leading-[1.12] font-bold mb-6 md:mb-8'>
                Podcasts, papers, books and blogs, curated just for you.
              </h1>
              <div className=''>
                <Button onClick={signIn}>
                  Get started
                </Button>
                <Button onClick={signIn} variant="grey" className='ml-4'>
                  Sign in
                </Button>
              </div>
              <div className='font-medium mb-4 text-gray-500 mt-44'>
                Pinned streams
              </div>
              {
                !streams || streams.length === 0 && (
                  <>
                    <Skeleton
                      height={100}
                      className='mb-1'
                    />
                    <Skeleton
                      height={100}
                      className='mb-1'
                    />
                    <Skeleton
                      height={100}
                      className='mb-1'
                    />
                    <Skeleton
                      height={100}
                      className='mb-1'
                    />
                  </>
                )
              }
              {
                streams.map((stream: any, streamIndex: number) => {
                  return (
                    <Link href={`/stream/${stream.id}`} key={streamIndex}>
                      <div
                        className={`pt-7 pb-7 border-t-2 border-gray-200 cursor-pointer flex justify-between items-center ${streamIndex === streams.length - 1 ? 'border-b-2' : ''}`}
                      >
                        <strong className="font-medium flex-grow pr-3">
                          {stream.name}
                        </strong>
                        <div className='mt-[-2px] flex-none flex w-[82px]'>
                          {
                            stream.content.map((content: any, contentIndex: number) => {
                              const onHover = () => {
                                setHovering({ streamIndex, contentIndex })
                              }

                              return (
                                <div
                                  // position: relative;
                                  // left: -5px;
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
              <div className='mt-8'>
                <Button
                  onClick={signIn}
                >
                  + Make your own stream
                </Button>
              </div>
              <div>
                <div className='font-medium mb-4 text-gray-500 mt-44'>
                  Look for clues
                </div>
                <div className='font-medium mb-4'>
                  <p className="mb-3">Everyday, we scan the web for you, collecting things you may need.</p>
                  <p className="mb-3">Anytime you want, you can pop in to get something new to read, listen to, or watch.</p>
                  <p className="mb-3">Sometimes you find a direct answer to a question. Sometimes you find new questions. And other times you find material you&apos;re able to build on in your current work.</p>
                  <p className="mb-3">This website is made to provide you with the clues you need—whether you&apos;re exploring new areas of science, solving a health issue, or writing your next paper.</p>
                  <p className="">We&apos;re just starting to test out the waters. <Link href="/sign-in" className='underline'>Join us.</Link></p>
                  {/* <Image
                    src='/stream-geese.jpeg'
                    className='my-7'
                    alt='testing-stream'
                    width={320}
                    height={320}
                  /> */}
                </div>
                <div className='font-medium mb-4 text-gray-500 mt-40'>Links</div>
                <div className='font-medium mb-52'>
                  <Link href='/sign-in'>
                    <div className='cursor-pointer mb-3'>
                      Get started
                    </div>
                  </Link>
                  <Link href='/sign-in'>
                    <div className='cursor-pointer mb-3'>
                      Sign in
                    </div>
                  </Link>
                  <Link href='/faqs'>
                    <div className='cursor-pointer mb-3'>
                      FAQs
                    </div>
                  </Link>
                  <Link href='mailto:thomas@streams.app'>
                    <div className='cursor-pointer mb-3'>
                      Support
                    </div>
                  </Link>
                </div>
              </div>
            </main>
          </>
        )
      }
    </>
  )
}
