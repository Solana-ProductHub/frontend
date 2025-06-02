import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react";
import type { UserApiResponse, User } from '@/lib/types';

const useUser = () => {
  const [showContent, setShowContent] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const { connected: isConnected, publicKey } = useWallet();

  const fetchConnectedUser = useCallback(async () => {
    if (!publicKey) return;

    setIsCheckingUser(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_ENDPOINT_URL}/api/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      });

      if (!response.ok) {
        throw new Error(`Failed to check/create user ${response?.status}`);
      }

      const result: UserApiResponse = await response.json();

      if (result.status) {
        setUser(result.data);
        setShowContent(true);
      }
    } catch (error) {
      console.error('User API error:', error);
    } finally {
      setIsCheckingUser(false);
    }
  }, [publicKey]);

  useEffect(() => {
    if (!isConnected || !publicKey) return;

    let isMounted = true;
    fetchConnectedUser().then(() => {
      if (!isMounted) return;
    });

    return () => {
      isMounted = false;
    };
  }, [isConnected, publicKey, fetchConnectedUser]);

  return useMemo(
    () => ({
      isCheckingUser,
      showContent,
      user,
      connected: isConnected,
      address: publicKey?.toString()
    }),
    [isCheckingUser, showContent, user]
  );
}

export default useUser