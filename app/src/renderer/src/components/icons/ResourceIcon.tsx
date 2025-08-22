import { IconInnerShadowBottomRightFilled, IconSchool, IconSword, IconUserFilled } from "@tabler/icons-react";

// const ResourceIcon = ({ resource, size }: { resource: string, size: number }) => {
//   return <div/>;
// }

const ResourceIcon = ({ resource, size }: { resource: string, size: number }) => {
  switch (resource) {
    case 'copper':
      return <IconInnerShadowBottomRightFilled viewBox="0 2 24 24" className="inline" color="#e78d5a" size={size}/>;
    case 'silver':
      return <IconInnerShadowBottomRightFilled viewBox="0 2 24 24" className="inline" color="#c0c0c0" size={size}/>;
    case 'yan_military_presence':
      return <IconSword viewBox="0 2 24 24" className="inline" color="#D0D050" size={size}/>;
    case 'yan_research':
      return <IconSchool viewBox="0 2 24 24" className="inline" color="#D0D050" size={size}/>;
    case 'yan_personnel':
      return <IconUserFilled viewBox="0 2 24 24" className="inline" color="#D0D050" size={size}/>;
    default:
      return null;
  }
}
export default ResourceIcon;
