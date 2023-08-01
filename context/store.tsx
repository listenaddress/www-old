import React, { Dispatch, createContext, useContext, useState, SetStateAction } from 'react';
import loadUser from '@/lib/loadUser';
// import { User } from '@/types/User';
import { useRouter, usePathname } from 'next/navigation';

interface ContextProps {
    // user: User | null;
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
    loadingUser: boolean;
    setLoadingUser: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContext = createContext<ContextProps>({
    user: null,
    setUser: () => { },
    loadingUser: true,
    setLoadingUser: () => { },
});

// const loadUserForBreadcrumbs = async (setUser: Dispatch<SetStateAction<User>>, setLoadingUser: Dispatch<SetStateAction<boolean>>, router: any, pathname: string) => {
const loadUserForBreadcrumbs = async (setUser: Dispatch<SetStateAction<any>>, setLoadingUser: Dispatch<SetStateAction<boolean>>, router: any, pathname: string) => {
    await loadUser(setUser, setLoadingUser, router, pathname)
    setLoadingUser(false)
}

/* @ts-ignore */
export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    // const [user, setUser] = useState<User>((null as unknown) as User);
    const [user, setUser] = useState<any>((null as unknown) as any);
    const [loadingUser, setLoadingUser] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        if (!user) loadUserForBreadcrumbs(setUser, setLoadingUser, router, pathname || "")
    }, [router, user, pathname]);

    return (
        <GlobalContext.Provider value={{ user, setUser, loadingUser, setLoadingUser } as any}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);