import { Box } from '@mui/material';

import { ValidatorsProvider } from '../../providers/ValidatorsProvider';
import ValidatorList from './components/ValidatorList';
import ValidatorStatistics from './components/ValidatorStatistcs';
import { Typography } from '@futureverse/component-library';
import ExternalLink from 'components/ExternalLink';
import { Content, ExtraContent, Header } from 'components/Layout';
import StakingCycleTimer from 'modules/shared/components/StakingCycleTimer';

const ValidatorsContent = () => {
  return (
    <ValidatorsProvider>
      <Box>
        <Header
          heading="Validators"
          subheading={
            <Typography
              variant="h5"
              color="secondary.dark"
              fontWeight={700}
              sx={{ width: '416px' }}
            >
              Validators verify transactions and add new blocks on The Root Network. Become a
              validator today.
            </Typography>
          }
          externalLink={
            <ExternalLink
              href="https://docs.therootnetwork.com/intro/participate/become-a-validator"
              content="View Documentation"
            />
          }
          content={<StakingCycleTimer />}
        />

        <Content>
          <ValidatorStatistics />
        </Content>

        <ExtraContent>
          <ValidatorList />
        </ExtraContent>
      </Box>
    </ValidatorsProvider>
  );
};

export default ValidatorsContent;
