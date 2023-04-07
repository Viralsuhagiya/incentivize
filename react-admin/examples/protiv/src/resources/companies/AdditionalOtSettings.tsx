import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Link, Stack } from '@mui/material';
import { BooleanInput, FormDataConsumer, useTranslate } from 'react-admin';
import { InfoLabel } from '../../components/fields/InfoLabel';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&.MuiAccordion-root.Mui-expanded': {
    boxShadow: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingTop:0
}));

export default function AdditionalOtSettings() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const translate = useTranslate();

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography variant="body2"><b>{translate('resources.companies.fields.additional_settings')}</b></Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormDataConsumer>
        {({ formData, ...rest }) => {
          return <><Stack sx={{ ml: 4 }} flexDirection={'row'} alignItems="center">
            <Typography variant="body2">{translate('resources.companies.fields.remove_ot_diff')}</Typography>
            <InfoLabel sx={{color:'red'}} icon="ri:error-warning-fill">
                <Stack>
                  <Typography>
                    "ProPay bonuses are considered "Non-discretionary Bonuses" to the U.S. Department of Labor. 
                  </Typography> 
                  <Stack direction="row">
                    Please refer to &nbsp;
                    <Link target='_blank' href="https://www.dol.gov/agencies/whd/fact-sheets/56c-bonuses" underline="always">
                      FLSA Fact Sheet 
                    </Link> 
                  </Stack>
                  and speak to legal counsel prior removing this flag."
                </Stack>
            </InfoLabel>
            <BooleanInput
              sx={{ paddingLeft: 2 }}
              source="remove_ot_diff"
              label=""
              disabled={formData?.include_ot_from_spent_total}
              helperText={false}
            />
          </Stack>
          <Stack sx={{ ml: 4 }} flexDirection={'row'} alignItems="center">
            <Typography variant="body2">{translate('resources.companies.fields.include_ot_from_spent_total')}</Typography>
            {formData?.include_ot_from_spent_total && <InfoLabel sx={{color:'red'}} icon="ri:error-warning-fill">
                <Stack>
                  <Typography>
                    "ProPay bonuses are suppose to be excluded from Overtime pay according to the U.S. Department of Labor. 
                  </Typography> 
                  <Stack direction="row">
                    Please refer to &nbsp;
                    <Link target='_blank' href="https://www.dol.gov/agencies/whd/fact-sheets/56c-bonuses" underline="always">
                      FLSA Fact Sheet 
                    </Link> 
                  </Stack>
                  and speak to legal counsel prior removing this flag."
                </Stack>
            </InfoLabel>}
            <BooleanInput
              sx={{ paddingLeft: 2 }}
              source="include_ot_from_spent_total"
              label=""
              helperText={false}
            />
          </Stack></>}}</FormDataConsumer>
        </AccordionDetails>
      </Accordion>
  );
}
