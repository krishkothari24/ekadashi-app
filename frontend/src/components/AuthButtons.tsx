import { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

interface Props {
  onAuthChange: (user: User | null) => void;
}

const AuthButtons: React.FC<Props> = ({ onAuthChange }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      onAuthChange(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex justify-end items-center gap-4 mb-4">
      {user ? (
        <>
          <span className="text-sm">Hello, {user.displayName}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default AuthButtons;
