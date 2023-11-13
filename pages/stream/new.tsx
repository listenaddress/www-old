import StreamForm from "@/components/streamForm";
import { useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/button";

export default function NewStream() {
    const onSubmit = async (name: string) => {
        try {
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                body: JSON.stringify({ name })
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
    const [streamName, setStreamName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSubmit = async () => {
        if (streamName && onSubmit) {
            const res = await onSubmit(streamName);
            if (!res || res.error) {
                setError(res.error);
                setLoading(false);
                return;
            }
            router.push(`/stream/${res.id}`);
        }
    };
    return (
        <>
            <div className='max-w-[34rem] m-auto mb-28 px-4 text-black'>
                <h3 className='mt-28 mb-3 text-md'>Name</h3>
                <input
                    type="text"
                    id="name"
                    autoComplete="off"
                    placeholder="E.g. 'Bioelectricity' or 'LLMs for Biomedical'"
                    className="w-full mb-4 px-4 py-2 border-none bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    value={streamName}
                    onChange={(e) => setStreamName(e.target.value)}
                />
                <Button
                    onClick={handleSubmit}
                    size='md'
                    disabled={!streamName}
                    className='mt-6 cursor-pointer'
                >
                    {'Create stream' + (loading ? '...' : '')}
                </Button>
                {error && <p className='text-red-500'>{error}</p>}
            </div>
        </>
    )
}
