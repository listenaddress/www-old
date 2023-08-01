"use client";
import { useState, useEffect } from 'react'
import Button from '@/components/button';
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/navbar';

export default function SignIn() {
    const [error, setError] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");
    const [calling, setCalling] = useState(false);
    const [verifyLink, setVerifyLink] = useState("");

    const signIn = async () => {
        if (calling) return;
        if (!process.env.NEXT_PUBLIC_API_URL) {
            setError("API URL not set");
            return;
        }

        setCalling(true);
        try {
            const res = await fetch(
                process.env.NEXT_PUBLIC_API_URL + "users/signin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email
                    })
                }
            );
            const jsonRes = await res.json();
            if (jsonRes.error) {
                setError(jsonRes.error);
                return;
            }
            setSubscribed(true);
            if (jsonRes.token) {
                setVerifyLink('/verify?token=' + jsonRes.token)
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
            <div className="max-w-lg px-4 m-auto mt-28 mb-24 text-sm">
                {!subscribed && (
                    <>
                        <h1 className="text-2xl font-bold">Sign into Streams</h1>
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
                                        signIn();
                                    }
                                }}
                            />
                            <Button
                                onClick={signIn}
                                size='md'
                                variant='blue'
                                className="mt-2"
                            >
                                Sign in
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">
                                First time here? Login above to create an account.
                            </p>
                            {error && (
                                <div className="mt-4 text-red-500">{error}</div>
                            )}
                        </div>
                    </>
                )}
                {subscribed && (
                    <>
                        <h1 className="text-2xl font-bold">Thanks for signing up! Check your email to get started</h1>
                        {
                            verifyLink && (
                                <Link href={verifyLink} className="text-blue-500 mt-2 inline-flex items-center">
                                    Verify email
                                </Link>
                            )
                        }
                    </>
                )}
            </div>
        </>
    )
}