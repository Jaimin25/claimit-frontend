'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import { Config } from '@/lib/config';
import { useMutation } from '@tanstack/react-query';

interface UserProps {
  username: string;
  firstname: string;
  lastname: string;
  initials: string;
  phoneno: number;
  profilePicUrl: string;
  role: 'USER' | 'MODS' | 'ADMIN';
  accountStatus: 'ACTIVE' | 'BLACKLIST' | 'BANNED';
  accountType: 'FREE' | 'PREMIUM';
  city: string;
  state: string;
  country: string;
  email: string;
  emailVerified: boolean;
  streetAddress: string;
  zipcode: number;
  identityVerified: boolean;
}

type UserUpdateProps = Omit<
  UserProps,
  | 'identityVerified'
  | 'role'
  | 'accountStatus'
  | 'accountType'
  | 'emailVerified'
>;

interface UserContextProps {
  user: UserProps | undefined | null;
  isAuthenticated: boolean;
  fetchUser: () => void;
  signOut: () => void;
  updateUserData: (user: UserUpdateProps) => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  isAuthenticated: false,
  fetchUser: () => {},
  signOut: () => {},
  updateUserData: () => {},
});

export const useUser = () => {
  return useContext(UserContext);
};

const fetchUserFn = async () => {
  return await axios.post(`${Config.API_URL}/user/getUserData`, '', {
    withCredentials: true,
  });
};

const checkAuthentication = async () => {
  return await axios.post(`${Config.API_URL}/authUser`, '', {
    withCredentials: true,
  });
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps | null>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: fetchUserFn,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        setUser(data.userData);
      } else {
        toast.error(data.statusMessage);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  const authMutation = useMutation({
    mutationFn: checkAuthentication,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  useEffect(() => {
    if (!user) {
      mutation.mutate();
      authMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = () => {
    mutation.mutate();
    authMutation.mutate();
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserData = (userData: UserUpdateProps) => {
    const currentUserData: UserProps = user as UserProps;

    const newUserData = {
      ...userData,
      emailVerified: currentUserData.emailVerified,
      identityVerified: currentUserData.identityVerified,
      role: currentUserData.role,
      accountStatus: currentUserData.accountStatus,
      accountType: currentUserData.accountType,
    };
    setUser(newUserData);
  };

  return (
    <UserContext.Provider
      value={{ user, fetchUser, isAuthenticated, signOut, updateUserData }}
    >
      {children}
    </UserContext.Provider>
  );
}
