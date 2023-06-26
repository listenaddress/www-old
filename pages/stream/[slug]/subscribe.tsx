import { useState, useEffect } from 'react'
import Button from '@/components/button';
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router'
import Navbar from '@/components/navbar';

export default function Subscribe() {
    const [error, setError] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");
    const [calling, setCalling] = useState(false);
    const [stream, setStream] = useState({} as any)
    const router = useRouter()
    const { slug } = router.query

    useEffect(() => {
        if (!slug) return
        const fetchStream = async () => {
            const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'streams/' + slug)
            const streamRes = await data.json()
            setStream(streamRes)
        }
        fetchStream()
    }, [slug])

    const postToMailChimp = async () => {
        if (calling) return;
        setCalling(true);
        try {
            const res = await fetch(
                window.location.origin + "/api/mailchimp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        signup: "Early Access",
                        stream: stream.slug
                    })
                }
            );
            const jsonRes = await res.json();

            if (jsonRes.error) {
                if (jsonRes.error.response.text.includes("is already a list member")) {
                    setError("You're already signed up!");
                } else if (jsonRes.error.response.text.includes("Invalid Resource")) {
                    setError("Please enter a valid email address. If this is a valid email address, please send me an email to thomas@streams.app and we'll get you signed up.");
                } else if (res.status === 400 || res.status === 500) {
                    setError("Something went wrong. Please try again or send an email to thomas@streams.app.");
                }
            }

            if (res.status === 201) {
                setSubscribed(true);
                setError("");
            }
        } catch (error: any) {
            setError(error.toString());
        }

        setCalling(false);
    }

    useEffect(() => {
        const input = document.querySelector("input");
        if (input) {
            input.focus();
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="max-w-lg px-4 m-auto mt-28 mb-24 text-sm">
                {!subscribed && (
                    <>
                        <h1 className="text-2xl font-bold">Subscribe to this stream</h1>
                        <div className="mt-6 text-sm">
                            Email address
                        </div>
                        <div className="mt-2">
                            <input
                                type="email"
                                placeholder="hello@streams.app"
                                className="w-full mb-4 px-4 py-2 border-none bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        postToMailChimp();
                                    }
                                }
                                }
                            />
                            <Button
                                onClick={postToMailChimp}
                                size='md'
                                variant='blue'
                            >
                                Subscribe
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">
                                We won&apos;t send you more than one email a week.
                            </p>
                            {error && (
                                <div className="mt-4 text-red-500">{error}</div>
                            )}
                        </div>
                    </>
                )}
                {subscribed && (
                    <>
                        <h1 className="text-2xl font-bold">Thanks for subscribing to {stream.name}!</h1>
                        <div>
                            <Link href={`/stream/${stream.slug}`}>
                                <div className='text-blue-500 cursor-pointer mt-4'>
                                    <span className='inline-block'>
                                        <ArrowLeftIcon width={18} strokeWidth={2} className='inline-block relative bottom-[2px] mr-2' />
                                    </span>
                                    Back the stream
                                </div>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}