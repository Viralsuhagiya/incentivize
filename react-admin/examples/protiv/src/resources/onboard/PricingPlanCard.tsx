import { Icon } from '@iconify/react';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
// material
import { styled } from '@mui/material/styles';
import { Card, Button, Typography, Box, Stack } from '@mui/material';
// routes

//
import Label from '../../components/Label';
import { NUMBER } from '../../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(NUMBER.THREE),
  [theme.breakpoints.up(414)]: {
    padding: theme.spacing(NUMBER.FIVE)
  }
}));

// ----------------------------------------------------------------------

type PricingPlanCardProps = {
  card: {
    id: number;
    label: string;
    price: number;
    caption: string;
    iconName: string;
    labelAction: string;
    lists: {
      text: string;
      available: boolean;
    }[];
    stripeId: string;
  };
  index: number;
  onDone: any;
  icons: any;
  defaultIcon: JSX.Element;
};

export default function PricingPlanCard({ card, index, onDone, icons, defaultIcon }: PricingPlanCardProps) {
  const { label, iconName, price, caption, lists, labelAction } = card;
  const icon = icons[iconName] || defaultIcon ;

  return (
    <RootStyle>
      {index === 1 && (
        <Label
          color="info"
          sx={{
            top: 16,
            right: 16,
            position: 'absolute'
          }}
        >
          POPULAR
        </Label>
      )}

      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        {index === 1 || index === NUMBER.TWO ? (
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            $
          </Typography>
        ) : (
          ''
        )}
        <Typography variant="h2" sx={{ mx: 1 }}>
          {price === 0 ? 'Free' : price}
        </Typography>
        {index === 1 || index === NUMBER.TWO ? (
          <Typography
            gutterBottom
            component="span"
            variant="subtitle2"
            sx={{
              alignSelf: 'flex-end',
              color: 'text.secondary'
            }}
          >
            /mo
          </Typography>
        ) : (
          ''
        )}
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: 'primary.main',
          textTransform: 'capitalize'
        }}
      >
        {caption}
      </Typography>

      <Box sx={{ width: 80, height: 80, mt: 3 }}>{icon}</Box>

      <Stack component="ul" spacing={2} sx={{ my: 5, width: 1 }}>
        {lists.map((item) => (
          <Stack
            key={item.text}
            component="li"
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ typography: 'body2', color: item.available ? 'text.primary' : 'text.disabled' }}
          >
            <Box component={Icon} fr='' icon={checkmarkFill} sx={{ width: 20, height: 20 }} />
            <Typography variant="body2">{item.text}</Typography>
          </Stack>
        ))}
      </Stack>

      <Button
        onClick={onDone}
        fullWidth
        size="large"
        variant="contained"
        // component={Link}
      >
        {labelAction}
      </Button>
    </RootStyle>
  );
}
