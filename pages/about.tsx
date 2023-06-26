"use client";
import Navbar from '@/components/navbar';
import { ThemeContext } from '@/context/theme';
import { ArrowLeftIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function About() {
    return (
        <>
            <Navbar />
            <div className="max-w-[36rem] px-4 m-auto mt-28 mb-24 text-sm">
                <h1 className="text-2xl font-bold">About</h1>
                <p className="mt-4">
                    This is a website that allows you to discover new content creators and their content.
                </p>
                <div>
                    <Link href="/">
                        <div className='text-blue-500 cursor-pointer mt-4'>
                            <span className='inline-block'>
                                <ArrowLeftIcon width={18} strokeWidth={2} className='inline-block relative bottom-[2px] mr-2' />
                            </span>
                            Back to home
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}
