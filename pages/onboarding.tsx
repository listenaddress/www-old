import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/button';
import { GlobalContext } from '@/context/store';
import React, { useContext } from 'react';

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const numOfSteps = 3;
    const [name, setName] = useState('');
    const { user, setUser, loadingUser } = useContext(GlobalContext);
    if (loadingUser) return <></>;

    return (
        <>
            <div className='m-auto'>
                <div className='flex justify-center mt-6'>
                    {
                        Array.from(Array(3).keys()).map((i) => {
                            return (
                                <div key={i} className={`inline-block w-[50px] h-[4px] bg-gray-300 ${i + 1 < step ? 'bg-gray-800' : ''} ${i + 1 === step ? 'bg-gray-900' : ''} ${i + 1 !== numOfSteps ? 'mr-2' : ''}`}></div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}