import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/button';
import { GlobalContext } from '@/context/store';
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Onboarding() {
    const numOfSteps = 5;
    const [name, setName] = useState('');
    const [streamName, setStreamName] = useState('');
    const [instructions, setInstructions] = useState('');
    const [inspiration, setInspiration] = useState('');
    const [inspirations, setInspirations] = useState([]);
    const [inspirationData, setInspirationData] = useState([]);
    const router = useRouter();
    const { user, setUser, loadingUser } = useContext(GlobalContext);
    const [step, setStep] = useState(user?.onboarding_step || 1);
    const [loading, setLoading] = useState(false);
    const [userStreams, setUserStreams] = useState([]);
    const [error, setError] = useState('');
    const fetchStreams = async () => {
        const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
        const streams = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessTokenFromCookie
            },
        })
        const streamsJson = await streams.json()
        if (streamsJson.error || !streamsJson || streamsJson.length === 0) {
            setError(streamsJson.error)
            return
        }
        setUserStreams(streamsJson)
        fetchUserActionsForStream(streamsJson[0].id)
    }

    const fetchUserActionsForStream = async (streamId: any) => {
        const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
        const actions = await fetch(process.env.NEXT_PUBLIC_API_URL + 'actions?user_id=' + user.id + '&stream_id=' + streamId, {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessTokenFromCookie
            },
        })
        const actionsJson = await actions.json()
        if (actionsJson.error) {
            setError(actionsJson.error)
            return
        }
        const likes = actionsJson.filter((action: any) => action.action_type === 'like')
        if (!likes || likes.length === 0) return
        const inspirationUrls = likes.map((like: any) => like.content && like.content.url)
        setInspirations(inspirationUrls)
    }



    useEffect(() => {
        setStep(user?.onboarding_step || 1);
        if (user?.onboarding_step > 3) {
            fetchStreams()
        }
    }, [user?.onboarding_step]);

    if (loadingUser) return <></>;

    const getButtonVariant = () => {
        if (step === 1 && !name) return 'disabled';
        if (step === 3 && !streamName) return 'disabled';
        if (step === 4 && !instructions) return 'disabled';
        if (loading) return 'disabled';

        return 'blue';
    }

    const getButtonText = () => {
        if (step === 5 && inspirations.length > 0) return 'See stream';
        if (step === 5 && inspirations.length === 0) return 'Skip';

        return 'Next';
    }

    const handleNextClick = async () => {
        if (step === 1) {
            setLoading(true);
            console.log("User", user)
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'users/' + user.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                body: JSON.stringify({
                    name,
                    onboarding_step: 2
                }),
            })
            const resJson = await res.json()
            if (resJson.error) {
                setError(resJson.error)
                setLoading(false)
                return
            }
            setUser({ ...user, name, onboardingStep: 2 })
            setStep(2);
            setLoading(false)
        } else if (step === 3) {
            // Create stream with stream name
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                body: JSON.stringify({
                    name: streamName
                }),
            })
            const resJson = await res.json()
            if (!resJson || resJson.error) {
                setError(resJson.error)
                setLoading(false)
                return
            }
            // @ts-ignore
            setUserStreams([resJson])
            const res2 = await fetch(process.env.NEXT_PUBLIC_API_URL + 'users/' + user.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                body: JSON.stringify({
                    onboarding_step: 4
                }),
            })
            const resJson2 = await res2.json()
            if (resJson2.error) {
                setError(resJson2.error)
            }
            // Going to try to finish out, dispite error
            setUser({ ...user, onboardingStep: 4 })
            setStep(step + 1)
        } else if (step === 4) {
            // Add instructions to first user stream
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            if (userStreams.length === 0) {
                setError('No user streams found')
                return
            }
            // @ts-ignore
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + userStreams[0].id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                body: JSON.stringify({
                    instructions
                }),
            })
            const resJson = await res.json()
            if (resJson.error) {
                setError(resJson.error)
                return
            }
            // @ts-ignore
            setUserStreams([{ ...userStreams[0], instructions }])
            const res2 = await fetch(process.env.NEXT_PUBLIC_API_URL + 'users/' + user.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                body: JSON.stringify({
                    onboarding_step: 5
                }),
            })
            const resJson2 = await res2.json()
            if (resJson2.error) {
                setError(resJson2.error)
            }
            // Going to try to finish out, dispite error
            setUser({ ...user, onboardingStep: 5 })
            setStep(step + 1)
        } else if (step === 5) {
            // @ts-ignore
            // Increment onboarding step
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'users/' + user.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                body: JSON.stringify({
                    name,
                    onboarding_step: step + 1,
                    onboarding_completed_at: Date.now()
                }),
            })
            const resJson = await res.json()
            if (resJson.error) {
                setError(resJson.error)
                return
            }
            setUser({ ...user, name, onboardingStep: step + 1, onboardingCompletedAt: Date.now() })
            // @ts-ignore
            router.push('/streams/' + userStreams[0].id)
        } else {
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'users/' + user.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                body: JSON.stringify({
                    name,
                    onboarding_step: step + 1
                }),
            })
            const resJson = await res.json()
            if (resJson.error) {
                setError(resJson.error)
                return
            }
            setUser({ ...user, name, onboardingStep: step + 1 })
            setStep(step + 1);
        }
    }

    const handleAddClick = async () => {
        setLoading(true)
        try {
            // @ts-ignore
            if (inspirations.includes(inspiration)) {
                setError('URL already added')
                setLoading(false)
                return
            }
            setLoading(true)
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: inspiration
                }),
            })
            const resJson = await res.json()
            console.log("Res", resJson)
            if (resJson.error) {
                setError(resJson.error)
                setLoading(false)
                return
            }
            const inspirationJson = resJson
            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
            const res2 = await fetch(process.env.NEXT_PUBLIC_API_URL + 'actions', {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessTokenFromCookie
                },
                'body': JSON.stringify({
                    action_type: 'like',
                    content_id: inspirationJson.id,
                    // @ts-ignore
                    stream_id: userStreams[0].id
                })
            })
            const resJson2 = await res2.json()
            console.log("Res2", resJson2)
            if (resJson2.error) {
                setError(resJson2.error)
                setLoading(false)
                return
            }

            // @ts-ignore
            setInspirationData([...inspirationData, inspirationJson])
            // @ts-ignore
            setInspirations([...inspirations, inspiration])
            setInspiration('')
            setError('')
        } catch (error: any) {
            console.log("Error", typeof error)
            setError(error.toString())
            setLoading(false)
            return
        }
        setLoading(false)
    }

    return (
        <>
            <div className='m-auto text-center max-w-xl'>
                <div className='flex justify-center mt-6'>
                    {
                        Array.from(Array(5).keys()).map((i) => {
                            return (
                                <div key={i} className={`inline-block w-[50px] h-[4px] bg-gray-300 ${i + 1 < step ? 'bg-gray-800' : ''} ${i + 1 === step ? 'bg-gray-900' : ''} ${i + 1 !== numOfSteps ? 'mr-2' : ''}`}></div>
                            )
                        })
                    }
                </div>
                {
                    step === 1 && (
                        <>
                            <h3 className='text-2xl mt-20 mb-6'>
                                Weclome to Streams! What&rsquo;s your name?
                            </h3>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your name here"
                                    className="w-[400px] mb-4 px-4 py-2 border-none bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </>
                    )
                }
                {
                    step === 2 && (
                        <>
                            <h3 className='text-2xl mt-20 mb-4'>
                                Hi {user.name}, let&rsquo;s make your first stream.
                            </h3>
                            <h3 className='text-2xl'>
                                Each stream will have new papers, podcasts, books and blogs on any research topic you&rsquo;re interested in.
                            </h3>
                        </>
                    )
                }
                {
                    step === 3 && (
                        <>
                            <h3 className='text-2xl mt-20 mb-4'>
                                What&rsquo;s the name of your stream?
                            </h3>
                            <input
                                type="text"
                                placeholder="E.g. 'Bioelectricity' or 'LLMs for Biomedical'"
                                className="w-full mb-4 px-4 py-2 border-none bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={streamName}
                                onChange={(e) => setStreamName(e.target.value)}
                            />
                        </>
                    )
                }
                {
                    step === 4 && (
                        <>
                            <h3 className='text-2xl mt-20 mb-4'>
                                Stream instructions
                            </h3>
                            <span className='text-sm text-gray-500'>
                                What kind of science are you looking for? We’ll keep this in mind as we scan the Internet.
                            </span>
                            <textarea
                                className='w-full h-40 mt-4 px-4 py-2 border-none bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                placeholder='I’m interested in...'
                                onChange={(e) => setInstructions(e.target.value)}
                            ></textarea>
                        </>
                    )
                }
                {
                    step === 5 && (
                        <>
                            <h3 className='text-2xl mt-20 mb-4'>
                                Examples
                            </h3>
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
                                                                {inspiration}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </>
                    )
                }
                <Button
                    onClick={handleNextClick}
                    size='md'
                    disabled={step === 1 && !name || (step === 3 && !streamName) || (step === 4 && !instructions)}
                    variant={getButtonVariant()}
                    className='mt-24'
                >
                    {getButtonText()}
                </Button>
            </div>
        </>
    )
}
