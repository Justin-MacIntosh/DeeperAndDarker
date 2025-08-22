import {
  IconFlowerFilled,
  IconPaperBag,
  IconBuildingBroadcastTower,
  IconBuildingFactory,
  IconRobot,
  IconHome,
  IconBolt,
  IconUser,
  IconBuilding,
  IconPlant2,
  IconPaw
} from "@tabler/icons-react";


export type IconOption =
  | "IconRobot"
  | "IconBuildingBroadcastTower"
  | "IconBuildingFactory"
  | "IconHome"
  | "IconBolt"
  | "IconUser"
  | "IconBuilding"
  | "IconFlowerFilled"
  | "IconPaperBag"
  | "IconPlant2"
  | "IconPaw";

export const ICON_MAPPING: { [Key in IconOption]: any } = {
  // Robotic icons
  IconRobot: IconRobot,
  IconBuildingBroadcastTower: IconBuildingBroadcastTower,
  IconBuildingFactory: IconBuildingFactory,

  IconHome: IconHome,
  IconBuilding: IconBuilding,
  IconBolt: IconBolt,
  IconUser: IconUser,
  IconPlant2: IconPlant2,
  IconPaw: IconPaw,

  // Planet icons
  IconFlowerFilled: IconFlowerFilled,
  IconPaperBag: IconPaperBag,
};
