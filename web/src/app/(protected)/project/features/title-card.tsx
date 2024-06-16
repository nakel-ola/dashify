import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  bottomCard?: ReactNode;
  classes?: {
    root?: string;
    text?: string;
    bottom?: string;
  };
};
export const TitleCard = (props: Props) => {
  const { title, subtitle, bottomCard, classes } = props;
  return (
    <div
      className={cn(
        'h-[200px] bg-slate-100/60 dark:bg-neutral-800/30 w-full flex flex-col px-5 lg:px-10 ',
        classes?.root
      )}
    >
      <p className={cn('text-4xl text-black dark:text-white ', subtitle ? 'mt-16' : 'my-auto', classes?.text)}>{title}</p>

      {subtitle && <p className='text-gray-light  '>{subtitle}</p>}

      {bottomCard ? <div className={cn('mt-auto', classes?.bottom)}>{bottomCard}</div> : null}
    </div>
  );
};
