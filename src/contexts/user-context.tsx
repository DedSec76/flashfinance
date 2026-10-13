"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction 
} from "react";

import type { UserProfile } from "@/types/user";

type UserContextValue = {
    user: UserProfile | null;
    setUser: Dispatch<SetStateAction<UserProfile | null>>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();
        const currentUser = data.user ?? data;

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
  );
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}

