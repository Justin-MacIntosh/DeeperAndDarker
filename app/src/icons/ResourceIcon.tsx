import { IconInnerShadowBottomRightFilled } from "@tabler/icons-react";

const ResourceIcon = ({ resource, size }: { resource: string, size: number }) => {

  switch (resource) {
    case 'copper':
      return <IconInnerShadowBottomRightFilled viewBox="0 2 24 24" className="inline" color="#e78d5a" size={size}/>;
    case 'silver':
      return <IconInnerShadowBottomRightFilled viewBox="0 2 24 24" className="inline" color="#c0c0c0" size={size}/>;
    default:
      return null;
  }
}
export default ResourceIcon;
