import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useContext, useState } from 'react'
import { useGlobalContext } from '../context/store'

const VerifyToken = () => {
    const params = useSearchParams();
    const token = params?.get('token')
    console.log("Token", token)
    const { user, setUser } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const setAccessToken = async () => {
        if (!token || loading) return

        const url = process.env.NEXT_PUBLIC_API_URL + 'users/verify'
        console.log("URL", url)
        try {
            setLoading(true)
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token
                }),
            })
            const { access_token, user } = await res.json();

            if (!access_token) {
                setLoading(false)
                router.push('/error')
                return
            }
            document.cookie = 'accessToken=' + access_token + ';path=/'
            setLoading(false)
            setUser({ email: user?.email, _id: "123" })
            router.push('/onboarding')
        } catch (error) {
            setLoading(false)
            console.log('Error', error)
        }
    }

    useEffect(() => {
        setAccessToken()
    }, [token]);

    return (
        <>
            <div>
                {
                    loading &&
                    <h1 style={{ marginTop: '31px', marginLeft: '0px', fontWeight: '300' }}>Logging you in 🌱🌱🌱</h1>
                }
            </div>
        </>
    )
}

export default VerifyToken