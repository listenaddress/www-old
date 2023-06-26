"use client";
import { useState, useEffect } from 'react'
import Button from '@/components/button';
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/navbar';

export default function RequestAccess() {
    const [error, setError] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");
    const [calling, setCalling] = useState(false);

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
                        <h1 className="text-2xl font-bold">Request early access to the app</h1>
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
                                Request Access
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">
                                In the app, you’ll get personalized recommendations and be able to make your own streams. We&apos;ll send an email when we&apos;re ready for you.
                            </p>
                            {error && (
                                <div className="mt-4 text-red-500">{error}</div>
                            )}
                        </div>
                    </>
                )}
                {subscribed && (
                    <>
                        <h1 className="text-2xl font-bold">Thanks for signing up! We&apos;ll let you know when we&apos;re is ready for you.</h1>
                        <div>
                            <Link href="/">
                                <div className='text-blue-500 cursor-pointer mt-4'>
                                    <span className='inline-block'>
                                        <ArrowLeftIcon width={18} strokeWidth={2} className='inline-block relative bottom-[2px] mr-2' />
                                    </span>
                                    Back home
                                </div>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}