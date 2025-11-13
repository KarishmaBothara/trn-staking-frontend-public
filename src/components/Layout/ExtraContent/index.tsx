import { Box } from '@mui/material';

const ExtraContent = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  return <Box sx={{ pt: 4, px: { xs: 1, lg: 7 } }}>{children}</Box>;
};

export default ExtraContent;
