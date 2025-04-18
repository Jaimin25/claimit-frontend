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

export interface CustomerBalanceTransactionsProps {
  id: string;
  amount: number;
  createdAt: number;
  description: string | null;
}

export interface UserBidsProps {
  title: string;
  amount: string;
  createdAt: string;
  auction: {
    id: string;
    title: string;
    auctionStatus: string;
  };
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
  userBalance: string | undefined;
  fetchUser: () => void;
  balanceTransactions: CustomerBalanceTransactionsProps[] | undefined;
  userBids: UserBidsProps[] | undefined;
  refreshUserBalance: () => void;
  refreshUserBids: (offset: number) => void;
  refreshUserBalanceTransactions: (value: {
    startingFrom: string;
    endingFrom: string;
  }) => void;
  signOut: () => void;
  updateUserData: (user: UserUpdateProps) => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  isAuthenticated: false,
  userBalance: '',
  balanceTransactions: [],
  userBids: [],
  fetchUser: () => {},
  refreshUserBalance: () => {},
  refreshUserBalanceTransactions: () => {},
  refreshUserBids: () => {},
  signOut: () => {},
  updateUserData: () => {},
});

export const useUser = () => {
  return useContext(UserContext);
};

const fetchUserFn = async () => {
  return await axios.post(`${Config.APP_URL}/api/user/getUserData`, '', {
    withCredentials: true,
  });
};

const checkAuthentication = async () => {
  return await axios.post(`${Config.APP_URL}/api/auth/authUser`, '', {
    withCredentials: true,
  });
};

const fetchUserBalanceTransactions = async (value: {
  startingFrom: string;
  endingFrom: string;
}) => {
  return await axios.post(
    `${Config.APP_URL}/api/user/fetchUserBalanceTransactions`,
    value,
    {
      withCredentials: true,
    }
  );
};

const fetchUserBids = async (offset: number) => {
  return await axios.post(
    `${Config.APP_URL}/api/user/fetchUserBids`,
    { offset },
    {
      withCredentials: true,
    }
  );
};

const fetchUserBal = async () => {
  return await axios.post(`${Config.APP_URL}/api/user/fetchUserBalance`, '', {
    withCredentials: true,
  });
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps | null>();
  const [userBalance, setUserBalance] = useState<string>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [balanceTransactions, setBalanceTransactions] =
    useState<CustomerBalanceTransactionsProps[]>();
  const [userBids, setUserBids] = useState<UserBidsProps[]>();

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

  const fetchUserBalanceMutation = useMutation({
    mutationFn: fetchUserBal,
    onSuccess: async (res) => {
      const data = await res.data;
      if (data.statusCode === 200) {
        setUserBalance(data.userBalance);
      } else {
        toast.error(data.statusMessage);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  const fetchUserBalanceTransactionsMutation = useMutation({
    mutationFn: fetchUserBalanceTransactions,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        setBalanceTransactions(data.balanceTransactions);
      } else {
        toast.error(data.statusMessage);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  const fetchUserBidsMutation = useMutation({
    mutationFn: fetchUserBids,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        setUserBids(data.userBids);
      } else {
        setUserBids([]);
        toast.error(data.statusMessage);
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

  const refreshUserBalance = () => {
    setUserBalance(undefined);
    fetchUserBalanceMutation.mutate();
  };

  const refreshUserBalanceTransactions = (value: {
    startingFrom: string;
    endingFrom: string;
  }) => {
    setBalanceTransactions(undefined);
    fetchUserBalanceTransactionsMutation.mutate(value);
  };

  const refreshUserBids = (offset: number) => {
    setUserBids(undefined);
    fetchUserBidsMutation.mutate(offset);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userBalance,
        fetchUser,
        balanceTransactions,
        userBids,
        refreshUserBalance,
        refreshUserBids,
        isAuthenticated,
        signOut,
        updateUserData,
        refreshUserBalanceTransactions,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
