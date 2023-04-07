import { alpha, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Backdrop(theme: Theme) {
  const varLow = alpha(theme.palette.grey[900], 0.48);
  const varHigh = alpha(theme.palette.grey[900], 1);

  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: [
            `rgba(0,0,0,0.5)`
          ],
          '&.MuiBackdrop-invisible': {
            background: 'transparent'
          }
        }
      }
    }
  };
}
