import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppKitAccount } from '@reown/appkit/react';
import type { UserApiResponse, User } from '@/lib/types';

const useUser = () => {
  const [showContent, setShowContent] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const { address, isConnected } = useAppKitAccount();

  const fetchConnectedUser = useCallback(async () => {
    if (!address) return;

    setIsCheckingUser(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_ENDPOINT_URL}/api/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address }),
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
  }, [address]);

  useEffect(() => {
    if (!isConnected || !address) return;

    let isMounted = true;
    fetchConnectedUser().then(() => {
      if (!isMounted) return;
    });

    return () => {
      isMounted = false;
    };
  }, [isConnected, address, fetchConnectedUser]);

  return useMemo(
    () => ({
      isCheckingUser,
      showContent,
      user,
    }),
    [isCheckingUser, showContent, user]
  );
}

export default useUser