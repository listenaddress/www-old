import React, { useState } from 'react';
import Button from './button';
import { useRouter } from 'next/router';
import { TrashIcon } from '@heroicons/react/24/outline'

function StreamForm({
    initialStreamName = '',
    initialInstructions = '',
    initialInspirations = [],
    // @ts-ignore
    onSubmit
}) {
    let initialInspirationContent: any[];
    if (initialInspirations) {
        initialInspirationContent = initialInspirations.map((inspiration) => inspiration.content);
    }
    const router = useRouter();
    const [streamName, setStreamName] = useState(initialStreamName);
    const [instructions, setInstructions] = useState(initialInstructions);
    const [inspiration, setInspiration] = useState('');
    const [inspirations, setInspirations] = useState(initialInspirationContent);
    const [deleting, setDeleting] = useState(false);
    const [inspirationHover, setInspirationHover] = useState(-1);
    const [error, setError] = useState('');
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
            setError('')
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

    const handleDelete = async (index: number) => {
        const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
        const isInInitialInspirations = initialInspirations.find((initialInspiration) => initialInspiration.content.id === inspirations[index].id)
        if (isInInitialInspirations) {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'actions/' + isInInitialInspirations.id, {
                method: 'DELETE',
                'headers': {
                    'Authorization': 'Bearer ' + accessTokenFromCookie,
                }
            })
            console.log(res)
            if (res.status !== 204) {
                setError('There was an error deleting the inspiration')
                return
            } else {
                console.log('deleted')
                setError('')
            }
        }
        // Delete the inspiration from the inspirations array
        const newInspirations = inspirations.filter((inspiration, i) => i !== index)
        setInspirations(newInspirations)
    }


    return (
        <div className='max-w-[34rem] m-auto px-4 text-black'>
            <h3 className='text-l mt-12 mb-3'>Name</h3>
            <input
                type="text"
                placeholder="E.g. 'Bioelectricity' or 'LLMs for Biomedical'"
                className="w-full mb-4 px-4 py-2 border-none bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={streamName}
                onChange={(e) => setStreamName(e.target.value)}
            />
            <h3 className='text-l mt-10 mb-1'>Instructions</h3>
            <span className='text-sm text-gray-500'>
                What kind of science are you looking for? We’ll keep this in mind as we scan the Internet.
            </span>
            <textarea
                className='w-full h-28 mt-4 px-4 py-2 border-none bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='I’m interested in...'
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
            <h3 className='text-l mt-10 mb-1'>References</h3>
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
                                            <div
                                                key={index}
                                                className='mt-2'
                                                onMouseEnter={() => setInspirationHover(index)}
                                                onMouseLeave={() => setInspirationHover(-1)}
                                            >
                                                {inspiration.title}
                                                {
                                                    inspirationHover === index && (
                                                        <TrashIcon
                                                            onClick={() => {
                                                                handleDelete(index)
                                                            }}
                                                            className={`inline-block w-4 h-4 ml-2 cursor-pointer ${deleting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                        />
                                                    )
                                                }
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
