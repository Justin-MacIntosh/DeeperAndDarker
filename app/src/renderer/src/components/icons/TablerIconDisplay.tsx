import { ICON_MAPPING, IconOption } from './types';

const TablerIconDisplay = ({ icon, size }: { icon: IconOption, size: number }) => {
  const IconElement = ICON_MAPPING[icon];
  return <IconElement size={size} />;
};
export default TablerIconDisplay;
