import { IconsListCard } from "@/components/IconsListCard";
import { Modal } from "@/components/Modal";
import { ProjectButton } from "@/components/ui/project-button";
import { deepCompare } from "@/lib/deepArrayCompare";
import React, { Fragment, useState } from "react";
import { IoCheckmark } from "react-icons/io5";
import { SchemaCard } from "./SchemaCard";

type Props = {
  collections: Collection[];
};

export const SchemasCard = (props: Props) => {
  const { collections } = props;

  const [items, setItems] = useState(collections);

  const [isActive, setIsActive] = useState<number | null>(null);

  const handleIconClick = (name: string) => {
    if (isActive === null) return;

    let newItems = [...items];

    newItems[isActive + 1] = {
      ...newItems[isActive + 1],
      icon: name,
    };

    setItems(newItems);

    setIsActive(null);
  };

  const handleTypeChange = (value: string, colInx: number, inx: number) => {
    let newItems = [...items];

    let collection = newItems[colInx + 1];

    collection.fields[inx].type = value;

    newItems[colInx] = collection;

    setItems(newItems);
  };

  return (
    <Fragment>
      <div className="mt-5">
        {items.slice(1).map(({ fields, icon, name }, index) => (
          <SchemaCard
            key={index}
            fields={fields}
            icon={icon as any}
            name={name}
            onIconClick={() => setIsActive(index)}
            onTypeChange={(value, fInx) => handleTypeChange(value, index, fInx)}
          />
        ))}

        <div className="space-x-5 ml-10 pb-5 flex items-center">
          <ProjectButton
            variant="outline"
            onClick={() => setItems(collections)}
          >
            Discard
          </ProjectButton>
          <ProjectButton disabled={deepCompare(collections, items)}>
            {" "}
            <IoCheckmark size={20} className="mr-2" /> Save
          </ProjectButton>
        </div>
      </div>

      <Modal
        open={isActive === null ? false : true}
        onOpenChange={() => setIsActive(null)}
        className="sm:max-w-[425px] lg:w-[425px]"
        classes={{
          root: "bg-project-white dark:bg-project-dark",
          button:
            "bg-project-white dark:bg-project-dark border-project-hover dark:border-project-hover-dark",
          buttonIcon:
            "text-project-text-color dark:text-project-text-color-dark",
        }}
      >
        <IconsListCard onIconClick={handleIconClick} />
      </Modal>
    </Fragment>
  );
};
