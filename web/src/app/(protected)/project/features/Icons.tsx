"use client";

import { IconProps, Settings, Setting, Category } from "iconsax-react";

export type IconNames = "Setting" | "Settings" | "Category";

type Props = IconProps & {
  iconName: IconNames;
};

const icons = {
  Category: Category,
  Settings: Settings,
  Setting: Setting,
};

export const Icons = (props: Props) => {
  const { iconName, ...rest } = props;

  const Icon = icons[iconName];

  return <Icon {...rest} />;
};
