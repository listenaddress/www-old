import StreamForm from "@/components/streamForm";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";

export default function EditStream() {
    const router = useRouter()
    const { id } = router.query
    const [initialStream, setInitialStream] = useState({})
    const onSubmit = async (name: string, instructions: string, inspirations: any[] = []) => {
        try {
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            const inspirationIds = inspirations.map(inspiration => inspiration.id)
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                body: JSON.stringify({
                    name,
                    instructions,
                    inspirations: inspirationIds
                }),
            })
            const resJson = await res.json()
            return resJson
        } catch (err: any) {
            if (err && err.toString && err.toString()) err = err.toString()
            return {
                error: err
            }
        }
    }

    useEffect(() => {
        if (!id) return
        const fetchStream = async () => {
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + id, {
                headers: {
                    'Authorization': `Bearer ${accessTokenFromCookie}`,
                    'Content-Type': 'application/json'
                }
            })
            const dataJson = await data.json()
            console.log(dataJson)
            setInitialStream(dataJson)
        }
        fetchStream()
    }, [id])

    let initialInspirations = []
    if (initialStream && initialStream.inspirations) {
        // Get content object from each inspiration and append to initialInspirations
        initialInspirations = initialStream.inspirations.map((inspiration: any) => inspiration.content)
    }

    return (
        <>
            {
                initialStream && initialStream.name && (
                    <StreamForm
                        onSubmit={onSubmit}
                        initialInstructions={initialStream.instructions}
                        initialStreamName={initialStream.name}
                        initialInspirations={initialStream.inspirations}
                    />
                )
            }
        </>
    )
}