import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/button';
import { GlobalContext } from '@/context/store';
import React, { useContext } from 'react';

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const { user, setUser, loadingUser } = useContext(GlobalContext);
    if (loadingUser) return <></>;
    console.log('user', user)
    return (
        <>Welcome to Steams!</>
    )
}