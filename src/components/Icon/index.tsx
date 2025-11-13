import RemovePositionSvg from '../../../assets/svgs/remove-position.svg';
import ExternalLinkSvg from '../../../assets/svgs/external-link.svg';
import AddPositionSvg from '../../../assets/svgs/add-position.svg';
import ArrowRightSvg from '../../../assets/svgs/arrow-right.svg';
import FPassLight from '../../../assets/svgs/FPassLight.svg';
import LogoSvg from '../../../assets/svgs/union.svg';
import { Box } from '@mui/material';

interface IProps {
  name: SvgNames;
  size?: number;
  backgroundColor?: 'secondary.dark' | 'primary.main' | 'primary.dark';
}

type SvgNames =
  | 'add-position'
  | 'remove-position'
  | 'external-link'
  | 'logo'
  | 'arrow-right'
  | 'FPassLight';

const svgs = {
  'add-position': AddPositionSvg,
  'remove-position': RemovePositionSvg,
  'external-link': ExternalLinkSvg,
  logo: LogoSvg,
  'arrow-right': ArrowRightSvg,
  FPassLight: FPassLight,
};

export const Icon = ({ name, size = 24, backgroundColor = 'primary.main' }: IProps) => {
  const Component = svgs[name];

  return (
    <Box
      component="span"
      sx={{
        borderRadius: '18px',
        height: size,
        width: size,
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Component && <Component />}
    </Box>
  );
};

export default Icon;
