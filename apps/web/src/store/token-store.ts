import { create } from "zustand";
import { type Token } from "types";

interface TokenState {
    tokens: Token[];
    setTokens: (tokens: Token[]) => void;
    addToken: (token: Token) => void;
}

export const useTokenStore = create<TokenState>()((set) => ({
    tokens: [],
    setTokens: (tokens) => set(() => ({
        tokens: tokens
    })),
    addToken: (token) => set((state) => ({
        tokens: [...state.tokens, token]
    }))
}));
