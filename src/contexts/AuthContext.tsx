import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  currentStreak: number;
  longestStreak: number;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const calculateStreak = () => {
    const lastLogin = localStorage.getItem("lastLoginDate");
    const storedCurrentStreak = parseInt(localStorage.getItem("currentStreak") || "0");
    const storedLongestStreak = parseInt(localStorage.getItem("longestStreak") || "0");
    
    const today = new Date().toDateString();
    
    if (!lastLogin) {
      // First login
      localStorage.setItem("currentStreak", "1");
      localStorage.setItem("longestStreak", "1");
      setCurrentStreak(1);
      setLongestStreak(1);
    } else if (lastLogin === today) {
      // Already logged in today
      setCurrentStreak(storedCurrentStreak);
      setLongestStreak(storedLongestStreak);
    } else {
      const lastDate = new Date(lastLogin);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        const newStreak = storedCurrentStreak + 1;
        const newLongest = Math.max(newStreak, storedLongestStreak);
        localStorage.setItem("currentStreak", newStreak.toString());
        localStorage.setItem("longestStreak", newLongest.toString());
        setCurrentStreak(newStreak);
        setLongestStreak(newLongest);
      } else {
        // Streak broken
        localStorage.setItem("currentStreak", "1");
        setCurrentStreak(1);
        setLongestStreak(storedLongestStreak);
      }
    }
    
    localStorage.setItem("lastLoginDate", today);
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      const storedCurrentStreak = parseInt(localStorage.getItem("currentStreak") || "0");
      const storedLongestStreak = parseInt(localStorage.getItem("longestStreak") || "0");
      setCurrentStreak(storedCurrentStreak);
      setLongestStreak(storedLongestStreak);
    }
  }, []);

  const login = (email: string, password: string) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    setIsAuthenticated(true);
    calculateStreak();
  };

  const signup = (name: string, email: string, password: string) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    setIsAuthenticated(true);
    calculateStreak();
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentStreak, longestStreak, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
