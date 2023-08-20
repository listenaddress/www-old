import StreamForm from "@/components/streamForm";

export default function NewStream() {
    const onSubmit = async (name: string, instructions: string, about: string, inspirations: any[] = [], access: string) => {
        try {
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            const inspirationIds = inspirations.map(inspiration => inspiration.id)
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                body: JSON.stringify({
                    name,
                    instructions,
                    inspirations: inspirationIds,
                    access
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
    return (
        <>
            <StreamForm onSubmit={onSubmit} initialAccess="private" />
        </>
    )
}
