import {
  Icon,
  IconProps,
  IconFlowerFilled,
  IconPaperBag,
  IconBuildingBroadcastTower,
  IconBuildingFactory,
  IconRobot,
  IconHome,
  IconBolt,
  IconBuilding,
} from "@tabler/icons-react";

export type IconOption =
  | "IconRobot"
  | "IconBuildingBroadcastTower"
  | "IconBuildingFactory"
  | "IconHome"
  | "IconBolt"
  | "IconBuilding"
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

  IconHome: IconHome,
  IconBuilding: IconBuilding,
  IconBolt: IconBolt,

  // Planet icons
  IconFlowerFilled: IconFlowerFilled,
  IconPaperBag: IconPaperBag,
};
