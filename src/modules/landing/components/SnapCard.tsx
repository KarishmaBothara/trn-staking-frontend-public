import { Box, Chip } from '@mui/material';

import { Typography } from '@futureverse/component-library';

interface SnapCardProps {
  id: string;
  title: string;
  content: string;
}

const SnapCard = ({ id, title, content }: SnapCardProps) => {
  return (
    <Box
      flexGrow={0}
      flexShrink={0}
      flexBasis={305}
      sx={{ backgroundColor: 'primary.dark', borderRadius: '26px', width: 305, height: 305, p: 3 }}
    >
      <Chip label={id} size="small" variant={'filled'} sx={{ mb: 6 }} />
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body2" fontWeight={700} color="secondary.light">
        {content}
      </Typography>
    </Box>
  );
};

export default SnapCard;
