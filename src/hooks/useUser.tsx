import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Pet, getUserPet } from "@/lib/api";

interface UserContextType {
  userId: number | null;
  setUserId: (id: number | null) => void;
  pet: Pet | null;
  setPet: (pet: Pet | null) => void;
  refreshPet: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number | null>(() => {
    // Load from localStorage
    const saved = localStorage.getItem("userId");
    return saved ? parseInt(saved) : null;
  });
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Save userId to localStorage when it changes
  useEffect(() => {
    if (userId !== null) {
      localStorage.setItem("userId", userId.toString());
    } else {
      localStorage.removeItem("userId");
    }
  }, [userId]);

  // Fetch pet data when userId changes
  const refreshPet = async () => {
    if (!userId) {
      setPet(null);
      return;
    }

    setIsLoading(true);
    try {
      const petData = await getUserPet(userId);
      setPet(petData);
    } catch (error) {
      console.error("Failed to fetch pet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      refreshPet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, setUserId, pet, setPet, refreshPet, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
