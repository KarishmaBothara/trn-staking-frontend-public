import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack } from '@mui/material';

import { Typography } from '@futureverse/component-library';
import { useRootTransaction } from 'providers/RootTransactionProvider';

const ExtrinsicData = () => {
  const { encodedMessage } = useRootTransaction();
  const rawMessage = encodedMessage?.rawMessage;
  return (
    <>
      {rawMessage && (
        <Accordion sx={{ width: { xs: '100%', lg: '50%' } }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ margin: '16px' }}
          >
            <Typography>More detail</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ overflow: 'auto' }}>
            <Stack spacing={4} sx={{ margin: '16px' }}>
              {Object.keys(rawMessage).map((item, index) => {
                const value = rawMessage[item];
                return (
                  <Stack key={item} direction="column" spacing={2}>
                    <Typography variant="body1" color="text.primary" textTransform="capitalize">
                      {item}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {(value as any).toString()}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};

export default ExtrinsicData;
