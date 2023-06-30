"use client";
import Navbar from '@/components/navbar';
import { ThemeContext } from '@/context/theme';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function About() {
    return (
        <>
            <Navbar />
            <div className="max-w-[36rem] px-4 m-auto mt-28 mb-24 text-sm">
                <h1 className="text-2xl font-bold">About</h1>
                <p className="mt-4">
                    <strong>What</strong>
                </p>
                <p className="mt-2">
                    Streams are ambient feeds of books, blogs, papers and podcasts, curated and summarized by AI. Soon you’ll be able to make your own streams, and you&apos;re welcomed to <Link href="/request-access" className='underline cursor-pointer'>sign up</Link> for early access now.
                </p>
                <p className="mt-4">
                    <strong>Why</strong>
                </p>
                <p className="mt-2">
                    Staying up to date on any research topic is a laborfest. It&apos;s not just finding every piece of research that might be important to you, it&apos;s digging into them to figure out which pieces matter to you. This sounded like a good task for AI—go out and read everything that might be interested to me and report back with the details I’d care about.
                </p>
                <p className="mt-4">
                    <strong>Who</strong>
                </p>
                <p className="mt-2">
                    I&rsquo;m Thomas O&apos;Brien and am lucky to have Joel Stremmel, Megan McCarthy, Michael Levin, and many others help me along the way. If you&rsquo;re interested in working on this with me, <Link href="mailto:tbobrien612@gmail.com" className='underline cursor-pointer'>hmu</Link>.
                </p>
                <div>
                    <Link href="/">
                        <div className='text-blue-500 cursor-pointer mt-4'>
                            <span className='inline-block'>
                                <ArrowUturnLeftIcon width={18} strokeWidth={2} className='inline-block relative bottom-[2px] mr-2' />
                            </span>
                            Back home
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}
