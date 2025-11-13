import Link from 'next/link';

import { Stack, Theme, styled } from '@mui/material';

import { Typography } from '@futureverse/component-library';
import Icon from 'components/Icon';

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ExternalLink = ({
  href,
  content,
  onClick,
}: {
  href?: string;
  content: string;
  onClick?: () => void;
}) => {
  return (
    <Stack
      direction={'row'}
      spacing={1}
      alignItems={'center'}
      sx={{ width: '100%', color: 'primary.main' }}
    >
      <StyledLink
        href={href ?? ''}
        target="_blank"
        rel="noreferrer"
        onClick={(evt) => {
          if (!href) evt.preventDefault();
          onClick?.();
        }}
      >
        <Icon name="external-link" size={20} />

        <Typography
          variant="button"
          sx={{
            ml: 1,
            fontWeight: 700,
            textTransform: 'none',
          }}
        >
          {content}
        </Typography>
      </StyledLink>
    </Stack>
  );
};

export default ExternalLink;
