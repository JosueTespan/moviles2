import React, { createContext, useContext, useState, useCallback } from 'react';

const Ctx = createContext(null);

export function ActiveChatProvider({ children }) {
    const [activeChatId, setActiveChatId] = useState(null);
    const [activeMessages, setActiveMessages] = useState([]);

    const clearActiveChat = useCallback(() => {
        setActiveChatId(null);
        setActiveMessages([]);
    }, []);

    const appendToActive = useCallback((msg) => {
        setActiveMessages(prev => [...prev, msg]);
    }, []);

    return (
        <Ctx.Provider value={{
            activeChatId,
            setActiveChatId,
            clearActiveChat,
            activeMessages,
            setActiveMessages,
            appendToActive,
        }}>
            {children}
        </Ctx.Provider>
    );
}

export function useActiveChat() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useActiveChat must be used inside ActiveChatProvider');
    return ctx;
}
