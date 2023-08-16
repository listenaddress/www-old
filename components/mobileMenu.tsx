"use client";
import Button from './button'
import { ThemeContext } from "@/context/theme"
import React, { useEffect, useState, useContext } from "react"
import { } from '@heroicons/react/20/solid'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { GlobalContext } from '@/context/store';
import { usePathname, useRouter } from 'next/navigation'

export default function MobileMenu() {
    const router = useRouter()
    const { user, setUser, loadingUser } = useContext(GlobalContext);
    const path = usePathname()
    const pathsToHideSideBar = ['/', '/sign-in', '/onboarding']

    return (
        pathsToHideSideBar.includes(path) ? null : (
            <div className={`block fixed sm:hidden bottom-4 left-4 h-[3.9rem] w-[3.9rem] border-2 border-gray-300 bg-gray-200 z-50 text-center rounded-xl p-[.8rem]`}>
                <Bars3Icon className={`w-8 h-8`} />
            </div>
        )
    )
}
