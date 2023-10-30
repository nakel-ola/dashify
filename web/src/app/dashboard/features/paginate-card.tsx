"use client";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";

type Props = {
  pageCount: number;
  page: number;
};
export const PaginateCard = (props: Props) => {
  const { pageCount, page } = props;

  const router = useRouter();

  const onPageChange = ({ selected }: { selected: number }) => {
    if (typeof selected !== "number" || Number.isNaN(selected)) return;

    router.push(`?page=${selected + 1}`);
  };
  return (
    <div className="grid place-items-center overflow-y-scroll w-full scrollbar-hide">
      <ReactPaginate
        breakLabel="•••"
        nextLabel={<ArrowRight2 className="h-6 w-6" />}
        onPageChange={onPageChange}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel={<ArrowLeft2 className="h-6 w-6" />}
        renderOnZeroPageCount={null}
        initialPage={page}
        containerClassName="rounded-lg flex items-center h-[45px] ml-4 overflow-hidden w-fit my-2 bg-rounded-full"
        previousClassName="hover:bg-slate-100 dark:bg-neutral-800 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg h-[40px] w-[40px] flex items-center justify-center border-[1.5px] border-slate-100 dark:border-neutral-800 cursor-pointer disabled:opactity-40 mx-1"
        nextClassName="hover:bg-slate-100 dark:bg-neutral-800 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg h-[40px] w-[40px] flex items-center justify-center border-[1.5px] border-slate-100 dark:border-neutral-800 cursor-pointer disabled:opactity-40 mx-1"
        breakClassName="text-black dark:text-white h-[40px] w-[40px] p-2 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 rounded-lg "
        pageClassName="hover:bg-slate-100 dark:bg-neutral-800 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg h-[40px] w-[40px] flex items-center justify-center border-[1.5px] border-slate-100 dark:border-neutral-800 cursor-pointer disabled:opactity-40 mx-1"
        activeClassName="bg-indigo-600 text-white hover:!bg-indigo-600 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg h-[40px] w-[40px] flex items-center justify-center mx-1 cursor-pointer disabled:opacity-40 border border-indigo-600"
      />
    </div>
  );
};
