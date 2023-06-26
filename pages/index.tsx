import { useEffect, useState } from 'react'

export default function Home() {
  const [streams, setStreams] = useState([] as any)

  useEffect(() => {
    const fetchStreams = async () => {
      const data = await fetch(window.location.origin + '/api/streams')
      let streamsRes = await data.json()
      console.log(streamsRes)
      setStreams([streamsRes])
    }
    fetchStreams()
  }, [])

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      Hey
    </main>
  )
}
