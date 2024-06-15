'use client';

import { Button } from '@/components/ui/button';
import { useSignOut } from '@/hooks/use-sign-out';
import { useUser } from '@/store/use-user';

type Props = {};
export const TopSection = (props: Props) => {
  const { user } = useUser();
  const signOut = useSignOut();

  return (
    <div className='bg-black h-[222px] -mt-[72px] pt-[50px] lg:pt-[72px] bg-[size:_75px_75px] bg-[image:_linear-gradient(to_right,_#262626_1px,_transparent_1px),_linear-gradient(to_bottom,_#262626_1px,_transparent_1px)]'>
      <div className='px-5 lg:px-10 py-4 pt-10 page-max-width flex flex-col lg:flex-row lg:items-center justify-between'>
        <p className='text-4xl lg:text-5xl font-medium text-white'>
          Hello, {user?.lastName} {user?.firstName}
        </p>

        <Button
          variant='solid'
          size='lg'
          onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
          className='border-neutral-800 border-[1.5px] rounded-full ml-auto mt-5 lg:mt-0'
        >
          Sign out
        </Button>
      </div>
    </div>
  );
};
