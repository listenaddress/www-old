import { Dispatch, SetStateAction } from 'react';

const loadUser = async (
    setUser: Dispatch<SetStateAction<any>>,
    setLoadingUser: Dispatch<SetStateAction<boolean>>,
    router: any,
    pathname: string
) => {
    if (typeof window === 'undefined') {
        setLoadingUser(false)
        return
    }
    const cookie = document.cookie
    if (!cookie || !cookie.includes('accessToken')) {
        setLoadingUser(false)
        return
    }
    const accessTokenFromCookie = cookie.split('accessToken=')[1].split(';')[0]
    if (!accessTokenFromCookie) {
        setLoadingUser(false)
        return
    }

    try {
        const currentUser = await fetch(process.env.NEXT_PUBLIC_API_URL + 'users/current', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessTokenFromCookie,
            },
        });

        if (!currentUser) {
            setLoadingUser(false)
            return
        }

        const currentUserJson = await currentUser.json()
        currentUserJson.accessToken = accessTokenFromCookie
        if (!currentUserJson) {
            setLoadingUser(false)
            return
        }

        if (currentUserJson['message'] && currentUserJson['message'] == 'User not found') {
            document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            setLoadingUser(false)
            return
        }

        if (!currentUserJson.onboarding_step || currentUserJson.onboarding_step > 6 && pathname !== '/onboarding') {
            setUser(currentUserJson);
            router.push('/onboarding')
            return
        }

        // if (!currentUser.data) return
        // if (!currentUser.data.onboardingComplete && pathname !== '/onboarding') {
        //     setUser(currentUser.data);
        //     router.push('/onboarding')
        //     return
        // }
        console.log(currentUserJson)
        setUser(currentUserJson);
    } catch (error) {
        console.log(error)
    }
    setLoadingUser(false)
}

export default loadUser;