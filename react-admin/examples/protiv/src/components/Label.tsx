// material
import { alpha, Theme, useTheme, styled } from '@mui/material/styles';
import { BoxProps } from '@mui/material';
// @types
import { ColorSchema } from '../@types/theme';
import { NUMBER } from '../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

type LabelColor = 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'pending' | 'approved' | 'paid' | 'cancelled';

type LabelVariant = 'filled' | 'outlined' | 'ghost';

const RootStyle = styled('span')(
  ({
    theme,
    ownerState
  }: {
    theme: Theme;
    ownerState: {
      color: LabelColor;
      variant: LabelVariant;
    };
  }) => {
    const isLight = theme.palette.mode === 'light';
    const { color, variant } = ownerState;

    const styleFilled = (colorCode: ColorSchema) => ({
      color: theme.palette[colorCode].contrastText,
      backgroundColor: theme.palette[colorCode].main
    });

    const styleOutlined = (colorCodes: ColorSchema) => ({
      color: theme.palette[colorCodes].main,
      backgroundColor: 'transparent',
      border: `1px solid ${theme.palette[colorCodes].main}`
    });

    const styleGhost = (coloCod: ColorSchema) => ({
      color: theme.palette[coloCod][isLight ? 'dark' : 'light'],
      backgroundColor: alpha(theme.palette[coloCod].main, NUMBER.ZERO_POINT_ONE_SIX)
    });

    return {
      height: 22,
      minWidth: 22,
      lineHeight: 0,
      borderRadius: 8,
      cursor: 'default',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      justifyContent: 'center',
      padding: theme.spacing(0, 1),
      color: theme.palette.grey[NUMBER.EIGHT_HUNDRED],
      fontSize: theme.typography.pxToRem(NUMBER.TWELVE),
      fontFamily: theme.typography.fontFamily,
      backgroundColor: theme.palette.grey[NUMBER.THREE_HUNDRED],
      fontWeight: theme.typography.fontWeightBold,

      ...(color !== 'default'
        ? {
            ...(variant === 'filled' && { ...styleFilled(color) }),
            ...(variant === 'outlined' && { ...styleOutlined(color) }),
            ...(variant === 'ghost' && { ...styleGhost(color) })
          }
        : {
            ...(variant === 'outlined' && {
              backgroundColor: 'transparent',
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.grey[500_32]}`
            }),
            ...(variant === 'ghost' && {
              color: isLight ? theme.palette.text.secondary : theme.palette.common.white,
              backgroundColor: theme.palette.grey[500_16]
            })
          })
    };
  }
);

// ----------------------------------------------------------------------

interface LabelProps extends BoxProps {
  color?: LabelColor;
  variant?: LabelVariant;
}

export default function Label({ color = 'default', variant = 'ghost', children, sx }: LabelProps) {
  const theme = useTheme();

  return (
    <RootStyle ownerState={{ color, variant }} sx={sx} theme={theme}>
      {children}
    </RootStyle>
  );
}
