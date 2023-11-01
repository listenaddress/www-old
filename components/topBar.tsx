import React, { useState, useContext } from "react";
import {
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowLeftOnRectangleIcon,
  Bars4Icon,
  CogIcon
} from '@heroicons/react/24/outline';
import { GlobalContext } from '@/context/store';
import { usePathname, useRouter } from 'next/navigation';
import Dropdown from './dropdown';
import Link from 'next/link';
import Popover from './popover';
import { showingSideBar } from '@/lib/helpers';
import seedrandom from 'seedrandom';

export default function TopBar() {
  const router = useRouter();
  const { user, setUser, loadingUser } = useContext(GlobalContext);
  const [hovering, setHovering] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const path = usePathname();

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
      <div className="fixed top-0 left-0 right-0 h-[65px] z-50 border-b-2 border-gray-300 bg-gray-100 bg-opacity-75 backdrop-filter backdrop-blur-md">
        <nav className="flex h-full justify-between items-center px-4">
          {/* Left section - Logo and Back Button */}
          <div className="flex items-center text-gray-600">
            <Link href="/">
              Streams
            </Link>
            {/* You can add more buttons/icons here, like a Back button */}
          </div>

          {/* Right section - User profile or Sign In */}
          <div className="flex items-center">
            {user ? (
              <div className="flex">
                <div
                  className="relative w-6 h-6 pt-2 pr-6 rounded-full flex justify-center items-center font-medium text-[#838288] mr-2"
                  onMouseEnter={() => setHovering('create-stream')}
                  onMouseLeave={() => setHovering('')}
                >
                  {
                    hovering === 'create-stream' && (
                      <Popover
                        text="Create stream"
                        left="-67"
                        bottom="-56" />
                    )
                  }
                  <Link href="/stream/new">
                    <PlusIcon className="h-6 w-6 text-gray-600 hover:text-gray-900 cursor-pointer" />
                  </Link>
                </div>
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full text-white flex justify-center items-center font-medium text-lg cursor-pointer"
                    style={{ background: generateGradient(user.email) }}
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  ></div>
                  {userDropdownOpen && (
                    <Dropdown
                      setIsOpen={() => setUserDropdownOpen}
                      left="-7" // Adjusted position for top bar
                      top="2" // Adjusted position for top bar
                      items={[
                        {
                          text: 'My streams',
                          onClick: (e: any) => {
                            router.push(`/user/${user.id}`);
                            setUserDropdownOpen(false);
                          },
                          icon: Bars4Icon
                        },
                        {
                          text: 'Sign out',
                          onClick: (e: any) => {
                            setUser(null);
                            const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0];
                            document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                            router.push('/');
                            setUserDropdownOpen(false);
                          },
                          icon: ArrowLeftOnRectangleIcon
                        }
                      ]}
                    />
                  )}
                </div>
              </div>
            ) : (
              <Link href="/sign-in">
                <button className="px-[12.5px] py-[6px] rounded-lg bg-gray-900 text-white">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    )
  );
}
