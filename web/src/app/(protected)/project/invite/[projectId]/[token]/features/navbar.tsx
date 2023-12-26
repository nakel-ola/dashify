import { UserCard } from "@/app/(protected)/dashboard/features/user-card";
import { ThemeButton } from "@/app/(protected)/project/features";
import Image from "next/image";
import Link from "next/link";

type Props = {};
export const Navbar = (props: Props) => {
  return (
    <div className="flex items-center justify-between px-5 lg:px-10 py-2 page-max-width border-b-[1.5px] border-slate-100 dark:border-neutral-800">
      <Link href="/" className="flex items-center cursor-pointer">
        <Image
          src="/logo.png"
          width={32}
          height={32}
          alt="Dashify logo"
          className="h-8 w-auto"
        />

        <p className="text-xl ml-2 font-black text-indigo-600">Dashify</p>
      </Link>

      <div className="flex items-center space-x-5">
        <ThemeButton />
        <UserCard isScrollUp={true} />
      </div>
    </div>
  );
};
