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

    </>
  )
}
