import React, { useState, useContext } from "react"
import { QuestionMarkCircleIcon, MagnifyingGlassIcon, PlusIcon, ArrowLeftOnRectangleIcon, Bars4Icon, CogIcon } from '@heroicons/react/24/outline'
import { GlobalContext } from '@/context/store'
import { usePathname, useRouter } from 'next/navigation'
import Dropdown from './dropdown'
import Link from 'next/link'
import Popover from './popover'
import { showingSideBar } from '@/lib/helpers'
import seedrandom from 'seedrandom'

export default function SideBar() {
    const router = useRouter()
    const { user, setUser, loadingUser } = useContext(GlobalContext);
    const [hovering, setHovering] = useState('')
    const [userDropdownOpen, setUserDropdownOpen] = useState(false)
    const path = usePathname()

    function stringToSeed(str: string) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    function generateGradient(email: string) {
        const seed = stringToSeed(email);
        const randomFromSeed = seedrandom(String(seed));
        const color1 = '#6ADA36';
        const color2 = '#E1F12C';
        const directions = ['to right', 'to left', 'to top', 'to bottom', 'to top right', 'to top left', 'to bottom right', 'to bottom left'];
        const direction = directions[Math.floor(randomFromSeed() * directions.length)];
        return `linear-gradient(${direction}, ${color1}, ${color2})`;
    }

    return (
        showingSideBar(path, user) && (
            <div className={`hidden sm:block sm:fixed top-0 left-0 h-screen w-[65px] border-r-2 border-gray-100 bg-white z-50`}>
                <nav className={`flex flex-col h-full justify-between`}>
                    {/* Top section */}
                    <div className={`flex justify-center items-center h-16 text-center`}>
                        <Link href={`/`}>
                            <div className={`w-8 h-8 rounded-full bg-black text-white flex justify-center items-center font-medium text-lg`}>
                                S
                            </div>
                        </Link>
                    </div>
                    {/* Middle section */}
                    <div className={`flex flex-col justify-center items-center flex-grow`}>
                        <div className={`flex justify-center items-center h-16 text-center`}>
                            <Link href={`${user ? '/stream/new' : '/sign-in'}`}>
                                <div
                                    className={`relative w-6 h-6 rounded-full flex justify-center items-center font-medium text-[#838288]`}
                                    onMouseEnter={() => setHovering('new-stream')}
                                    onMouseLeave={() => setHovering('')}
                                >
                                    {
                                        hovering === 'new-stream' && (
                                            <Popover text={`Create a new stream`} left="36" bottom="-10" />
                                        )
                                    }
                                    <PlusIcon className={`w-6 h-6`} />
                                </div>
                            </Link>
                        </div>
                        {/* <div className={`flex justify-center items-center h-16 text-center`}>
                            <div className={`w-6 h-6 rounded-full flex justify-center items-center font-medium text-[#838288]`}>
                                <MagnifyingGlassIcon className={`w-6 h-6`} />
                            </div>
                        </div> */}
                        <div className={`flex justify-center items-center h-16 text-center`}>
                            <Link href="/faqs">
                                <div
                                    className={`w-6 h-6 rounded-full flex justify-center items-center font-medium text-[#838288] relative`}
                                    onMouseEnter={() => setHovering('faqs')}
                                    onMouseLeave={() => setHovering('')}
                                >
                                    {
                                        hovering === 'faqs' && (
                                            <Popover text={`FAQs`} left="36" bottom="-10" />
                                        )
                                    }
                                    <QuestionMarkCircleIcon className={`w-6 h-6`} />
                                </div>
                            </Link>
                        </div>
                        {
                            user?.is_admin && (
                                <div className={`flex justify-center items-center h-16 text-center`}>
                                    <Link href="/admin">
                                        <div
                                            className={`w-6 h-6 rounded-full flex justify-center items-center font-medium text-[#838288] relative`}
                                            onMouseEnter={() => setHovering('admin')}
                                            onMouseLeave={() => setHovering('')}
                                        >
                                            {
                                                hovering === 'admin' && (
                                                    <Popover text={`Admin`} left="36" bottom="-10" />
                                                )
                                            }
                                            <CogIcon className={`w-6 h-6`} />
                                        </div>
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                    {/* Bottom section */}
                    <div className={`flex justify-center items-center h-16`}>
                        {user?.name && (
                            <div className='relative'>
                                <div
                                    className={`w-8 h-8 rounded-full text-white flex justify-center items-center font-medium text-lg cursor-pointer`}
                                    style={{ background: generateGradient("hiiiiiiiiiiiiiiiiiiiiiiiii!shhh?") }}
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                ></div>
                                {
                                    userDropdownOpen && (
                                        <>
                                            <Dropdown
                                                setIsOpen={() => setUserDropdownOpen}
                                                left="2.4"
                                                top="-4.53"
                                                items={[
                                                    {
                                                        text: 'My streams',
                                                        onClick: (e: any) => {
                                                            router.push(`/user/${user.id}`)
                                                            setUserDropdownOpen(false)
                                                        },
                                                        icon: Bars4Icon
                                                    },
                                                    {
                                                        text: 'Sign out',
                                                        onClick: (e: any) => {
                                                            setUser(null)
                                                            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
                                                            document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                                                            router.push('/')
                                                            setUserDropdownOpen(false)
                                                        },
                                                        icon: ArrowLeftOnRectangleIcon
                                                    }
                                                ]}
                                            />
                                        </>
                                    )
                                }
                            </div>
                        )}
                    </div>
                </nav >
            </div >
        )
    )
}