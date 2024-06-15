import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment, PropsWithChildren } from 'react';
import { TitleCard } from './auth/features';
import type { Metadata } from 'next';
import { BlackGradientCard } from '../features/black-gradient-card';

export const metadata: Metadata = {
  title: 'Auth | Dashify',
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <Link href='/'>
        <div className='flex items-center cursor-pointer p-5'>
          <Image src='/logo.png' width={32} height={32} alt='Dashify logo' className='h-8 w-auto' />
          <p className='text-black dark:text-white text-xl ml-2 font-bold'>Dashify</p>
        </div>
      </Link>

      <main className='grid grid-cols-10 min-h-full'>
        <section className='col-span-10 lg:col-span-4 h-fit grid place-items-center py-20 px-10'>
          <TitleCard />
          {children}
        </section>

        <BlackGradientCard
          classes={{
            root: '-mt-[72px] min-h-[100vh] col-span-6 bg-transparent hidden lg:block [background-image:_linear-gradient(to_right,_rgb(209_213_219)_1px,_transparent_1px),_linear-gradient(to_bottom,_rgb(209_213_219)_1px,_transparent_1px)] dark:[background-image:_linear-gradient(to_right,_#262626_1px,_transparent_1px),_linear-gradient(to_bottom,_#262626_1px,_transparent_1px)]',
            child:
              'flex items-center justify-center flex-col page-max-width [background:_radial-gradient(ellipse_50%_80%_at_50%_50%,rgba(93,52,221,0.0),transparent)] overflow-hidden',
          }}
        >
          <div className='mr-[-500px] p-2 bg-slate-100 dark:bg-neutral-800 max-w-5xl rounded-2xl mx-5'>
            <Image
              src='/images/dashify-dark.webp'
              alt='Hero image Dark mode'
              width={1000}
              height={500}
              className='transition-opacity rounded-xl hidden dark:block z-10'
            />
            <Image
              src='/images/dashify-light.webp'
              alt='Hero image Light mode'
              width={1000}
              height={500}
              className='transition-opacity rounded-xl border-[1.5px] shadow-md dark:border-gray-700 border-gray-300 dark:hidden'
            />
          </div>
        </BlackGradientCard>
      </main>
    </Fragment>
  );
}
