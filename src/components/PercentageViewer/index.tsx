import { styled } from '@mui/material';

import { Typography } from '@futureverse/component-library';

interface IProps {
  value: number | string;
}

const Percentage = styled('span')`
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 48vw;
  overflow-x: hidden;
  overflow-y: hidden;
  display: inline-block;
`;

const PercentageViewer = ({ value }: IProps) => {
  return (
    <Typography
      variant="h3"
      color="primary.main"
      sx={{ fontSize: 110, fontWeight: 700, lineHeight: '90px' }}
    >
      <Percentage>{value}</Percentage>%
    </Typography>
  );
};

export default PercentageViewer;
