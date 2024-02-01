import Image from "next/image";

type Props = {};
export const AddNewRowCard = (props: Props) => {
  return (
    <div className="grid place-items-center h-[calc(100%-50px)]">
      <div className="text-center">
        <Image src="/empty.svg" alt="" width={200} height={200} />
        <p className="">This table is empty</p>
      </div>
    </div>
  );
};
