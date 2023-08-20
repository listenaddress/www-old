import Button from './button'
import { ThemeContext } from "@/context/theme"
import React, { useEffect, useState, useContext } from "react"
import { } from '@heroicons/react/20/solid'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { GlobalContext } from '@/context/store';
import { usePathname, useRouter } from 'next/navigation'
import { showingSideBar } from '@/lib/helpers'

export default function MobileMenu() {
    const router = useRouter()
    const { user, setUser, loadingUser } = useContext(GlobalContext);
    const [showingMenu, setShowingMenu] = useState(false)
    const path = usePathname()

    return (
        showingSideBar(path, user) && (
            <>
                <div
                    className={`block fixed sm:hidden bottom-4 left-4 h-[3.9rem] w-[3.9rem] border-2 border-gray-300 bg-gray-200 z-50 text-center rounded-xl p-[.8rem]`}
                    onClick={() => setShowingMenu(true)}
                >
                    <Bars3Icon className={`w-8 h-8`} />
                </div>
                {
                    showingMenu && (
                        <div className={`fixed top-0 left-0 h-screen w-screen bg-white z-50`}>
                            <div className={`flex justify-between items-center h-16 border-gray-100 pl-5 pt-2 mb-4`}>
                                <div
                                    className={`flex justify-center items-center h-16 text-center`}
                                    onClick={() => setShowingMenu(false)}
                                >
                                    <XMarkIcon className={`w-8 h-8`} />
                                </div>
                            </div>
                            <div className={`flex flex-col justify-center items-center flex-grow`}>
                                <div
                                    className={`flex justify-center items-center h-16 text-center`}
                                    onClick={() => {
                                        router.push(`/`)
                                        setShowingMenu(false)
                                    }}
                                >
                                    <h2>Home</h2>
                                </div>
                                {
                                    user && (
                                        <>
                                            <div
                                                className={`flex justify-center items-center h-16 text-center`}
                                                onClick={() => {
                                                    router.push(`${user ? '/stream/new' : '/sign-in'}`)
                                                    setShowingMenu(false)
                                                }}
                                            >
                                                <h3>New stream</h3>
                                            </div>
                                            <div
                                                className={`flex justify-center items-center h-16 text-center`}
                                                onClick={() => {
                                                    router.push(`/user/${user.id}`)
                                                    setShowingMenu(false)
                                                }}
                                            >
                                                <h3>My streams</h3>
                                            </div>
                                        </>
                                    )
                                }
                                <div
                                    className={`flex justify-center items-center h-16 text-center`}
                                    onClick={() => {
                                        router.push(`/faqs`)
                                        setShowingMenu(false)
                                    }}
                                >
                                    <h3>FAQs</h3>
                                </div>
                                {
                                    user ? (
                                        <div
                                            className={`flex justify-center items-center h-16 text-center`}
                                            onClick={() => {
                                                setUser(null)
                                                document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                                                router.push('/')
                                                setShowingMenu(false)
                                            }}
                                        >
                                            <h3>Sign out</h3>
                                        </div>
                                    ) : (
                                        <div
                                            className={`flex justify-center items-center h-16 text-center`}
                                            onClick={() => {
                                                router.push(`/sign-in`)
                                                setShowingMenu(false)
                                            }}
                                        >
                                            <h3>Sign in</h3>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </>
        )
    )
}
