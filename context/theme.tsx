"use client";
import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // TODO: load theme from global context
    const [theme, setTheme] = useState('light');

    return (
        <ThemeContext.Provider value={{ theme, setTheme } as any}>
            {children}
        </ThemeContext.Provider>
    );
};
