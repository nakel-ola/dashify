'use client';

import { GoogleColoredIcon } from '@/components/GoogleColored';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
type Props = {};

const GoogleLoginButton = (props: Props) => {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl');
  return (
    <div
      className='border-[1.5px] border-slate-100 dark:border-neutral-800 sm:mx-auto sm:w-full sm:max-w-md py-1.5 rounded-md flex items-center justify-center mt-10 cursor-pointer hover:bg-slate-100 hover:dark:bg-neutral-900'
      onClick={() => signIn('google', { redirect: true, callbackUrl: callbackUrl ?? '/dashboard' })}
    >
      <GoogleColoredIcon className='size-7 mt-1.5' />
      Sign in with Google
    </div>
  );
};

export { GoogleLoginButton };
