import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import api from '../services/api';

type User = {
  id: number
  name: string
  email: string
  birthday: string
  image: string
  city: string
  state: string
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  token: string;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [cookie, setCookie] = useCookies(['user', 'token'])

  const [data, setData] = useState<AuthState>(() => {
    const { user, token } = cookie

    if (token && user) {
      console.log({ user })
      return { token, user };
    }
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const {
      data: { token, user },
    } = await api.post('sessions', {
      email,
      password,
    });

    setCookie('token', token, {
      maxAge: 3600,
      path: '/',
      sameSite: true
    });

    setCookie('user', JSON.stringify(user), {
      maxAge: 3600,
      path: '/',
      sameSite: true
    });

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {

    setCookie('token', '', { maxAge: 0 });

    setCookie('user', '', { maxAge: 0 });

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      setCookie('user', JSON.stringify(user), {
        path: '/',
        sameSite: true,
        maxAge: 3600
      })
      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider value={{ user: data.user, token: data.token, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used with an AuthProvider');

  return context;
}
