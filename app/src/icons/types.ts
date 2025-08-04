import {
  Icon,
  IconProps,
  IconFlowerFilled,
  IconPaperBag,
  IconBuildingBroadcastTower,
  IconBuildingFactory,
  IconRobot,
} from "@tabler/icons-react";

export type IconOption =
  | "IconRobot"
  | "IconBuildingBroadcastTower"
  | "IconBuildingFactory"
  | "IconFlowerFilled"
  | "IconPaperBag";

type iconType = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<Icon>
>;
export const ICON_MAPPING: { [Key in IconOption]: iconType } = {
  // Robotic icons
  IconRobot: IconRobot,
  IconBuildingBroadcastTower: IconBuildingBroadcastTower,
  IconBuildingFactory: IconBuildingFactory,

  // Planet icons
  IconFlowerFilled: IconFlowerFilled,
  IconPaperBag: IconPaperBag,
};
