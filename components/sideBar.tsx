"use client";
import Button from './button'
import { ThemeContext } from "@/context/theme"
import React, { useEffect, useState, useContext } from "react"
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { QuestionMarkCircleIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { GlobalContext } from '@/context/store';
import { usePathname, useRouter } from 'next/navigation'
import Dropdown from './dropdown'
import Link from 'next/link'

export default function SideBar() {
    const router = useRouter()
    const { user, setUser, loadingUser } = useContext(GlobalContext);
    // Get path
    const path = usePathname()
    const pathsToHideSideBar = ['/', '/sign-in', '/onboarding']

    return (
        pathsToHideSideBar.includes(path) ? null : (
            <div className={`fixed top-0 left-0 h-screen w-[65px] border-r border-gray-200 bg-white z-50`}>
                <nav className={`flex flex-col h-full justify-between`}>
                    {/* Top section */}
                    <div className={`flex justify-center items-center h-16 text-center`}>
                        <div className={`w-8 h-8 rounded-full bg-black text-white flex justify-center items-center font-medium text-lg`}>
                            S
                        </div>
                    </div>
                    {/* Middle section */}
                    <div className={`flex flex-col justify-center items-center flex-grow`}>
                        <div className={`flex justify-center items-center h-16 text-center`}>
                            <div className={`w-6 h-6 rounded-full flex justify-center items-center font-medium text-[#838288]`}>
                                <PlusIcon className={`w-6 h-6`} />
                            </div>
                        </div>
                        <div className={`flex justify-center items-center h-16 text-center`}>
                            <div className={`w-6 h-6 rounded-full flex justify-center items-center font-medium text-[#838288]`}>
                                <MagnifyingGlassIcon className={`w-6 h-6`} />
                            </div>
                        </div>
                        <div className={`flex justify-center items-center h-16 text-center`}>
                            <div className={`w-6 h-6 rounded-full flex justify-center items-center font-medium text-[#838288]`}>
                                <QuestionMarkCircleIcon className={`w-6 h-6`} />
                            </div>
                        </div>
                    </div>
                    {/* Bottom section */}
                    <div className={`flex justify-center items-center h-16`}>
                        {user?.name && (
                            <div className={`w-8 h-8 rounded-full bg-gray-500 text-white flex justify-center items-center font-medium text-lg`}>
                                {user.name[0]}
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        )
    )
}