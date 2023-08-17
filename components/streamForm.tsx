import React, { useState } from 'react';
import Button from './button';
import { useRouter } from 'next/router';

function StreamForm({
    initialStreamName = '',
    initialInstructions = '',
    initialInspirations = [],
    // @ts-ignore
    onSubmit
}) {
    const router = useRouter();
    const [streamName, setStreamName] = useState(initialStreamName);
    const [instructions, setInstructions] = useState(initialInstructions);
    const [inspiration, setInspiration] = useState('');
    const [inspirations, setInspirations] = useState(initialInspirations);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAddClick = async () => {
        if (inspiration && !loading) {
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            setLoading(true);
            const content = await fetch(process.env.NEXT_PUBLIC_API_URL + 'content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                body: JSON.stringify({
                    url: inspiration
                }),
            });
            setLoading(false);
            const contentJson = await content.json();
            if (contentJson.error) {
                setError(contentJson.error);
                return;
            }

            // @ts-ignore
            setInspirations([...inspirations, contentJson]);
            setInspiration('');
        }
    };

    const handleSubmit = async () => {
        if (streamName && instructions && onSubmit) {
            const res = await onSubmit(streamName, instructions, inspirations);
            if (!res || res.error) {
                setError(res.error);
                setLoading(false);
                return;
            }
            router.push(`/stream/${res.id}`);
        }
    };

    return (
        <div className='max-w-[34rem] m-auto px-4 text-black'>
            <h3 className='text-l mt-12 mb-3'>Name</h3>
            <input
                type="text"
                placeholder="E.g. 'Bioelectricity' or 'LLMs for Biomedical'"
                className="w-full mb-4 px-4 py-2 border-none bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setStreamName(e.target.value)}
            />
            <h3 className='text-l mt-10 mb-1'>Instructions</h3>
            <span className='text-sm text-gray-500'>
                What kind of science are you looking for? We’ll keep this in mind as we scan the Internet.
            </span>
            <textarea
                className='w-full h-40 mt-4 px-4 py-2 border-none bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='I’m interested in...'
                onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
            <h3 className='text-l mt-10 mb-1'>Examples</h3>
            <span className='text-sm text-gray-500'>
                Any links, papers, podcasts, books, etc. that&apos;d be examples of what you&apos;re looking for?
            </span>
            <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=2Oe6HUgrRlQ"
                className="w-full mb-4 mt-4 px-4 py-2 border-none bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={inspiration}
                onChange={(e) => setInspiration(e.target.value)}
            />
            <div>
                <Button
                    onClick={handleAddClick}
                    size='md'
                    variant={inspiration && !loading ? 'blue' : 'disabled'}
                    className='mt-4'
                    disabled={!inspiration || loading}
                >
                    Add
                </Button>
                {
                    error && (
                        <div className='mt-4 text-red-500'>
                            {error}
                        </div>
                    )
                }
                {
                    inspirations && (
                        <div className='mt-4'>
                            <div className='text-sm text-gray-500'>
                                {
                                    inspirations.map((inspiration, index) => {
                                        return (
                                            <div key={index} className='mt-2'>
                                                {inspiration.title}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <Button
                onClick={handleSubmit}
                size='md'
                disabled={!streamName || !instructions}
                variant='blue'
                className='mt-12 mb-20 cursor-pointer'
            >
                {initialStreamName ? 'Update Stream' : 'Save Stream'}
            </Button>
        </div>
    );
}

export default StreamForm;
