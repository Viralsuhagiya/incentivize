import NProgress from 'nprogress';
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
// material
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Box, GlobalStyles } from '@mui/material';
//
import Logo from './Logo';
import { NUMBER } from '../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export function ProgressBarStyle() {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        '#nprogress': {
          pointerEvents: 'none',
          '& .bar': {
            top: 0,
            left: 0,
            height: 2,
            width: '100%',
            position: 'fixed',
            zIndex: theme.zIndex.snackbar,
            backgroundColor: theme.palette.primary.main,
            boxShadow: `0 0 2px ${theme.palette.primary.main}`
          },
          '& .peg': {
            right: 0,
            opacity: 1,
            width: 100,
            height: '100%',
            display: 'block',
            position: 'absolute',
            transform: 'rotate(3deg) translate(0px, -4px)',
            boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`
          }
        }
      }}
    />
  );
}

function ProgressBar() {
  NProgress.configure({
    showSpinner: false
  });

  useMemo(() => {
    NProgress.start();
  }, []);

  useEffect(() => {
    NProgress.done();
  }, []);

  return null;
}

export default function LoadingScreen({ ...other }) {
  return (
    <>
      <ProgressBar />

      <RootStyle {...other}>
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeatDelay: 1,
            repeat: Infinity
          }}
        >
          <Logo/>
        </motion.div>

        <Box
          component={motion.div}
          animate={{
            scale: [NUMBER.ONE_POINT_TWO, NUMBER.ONE, NUMBER.ONE, NUMBER.ONE_POINT_TWO, NUMBER.ONE_POINT_TWO],
            rotate: [NUMBER.TWOHUNDRED_SEVENTY, 0, 0, NUMBER.TWOHUNDRED_SEVENTY, NUMBER.TWOHUNDRED_SEVENTY],
            opacity: [NUMBER.ZERO_POINT_TWENTY_FIVE, 1, 1, 1, NUMBER.ZERO_POINT_TWENTY_FIVE],
            borderRadius: ['25%', '25%', '50%', '50%', '25%']
          }}
          transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
          sx={{
            width: 100,
            height: 100,
            borderRadius: '25%',
            position: 'absolute',
            border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, NUMBER.ZERO_POINT_TWENTY_FOUR)}`
          }}
        />

        <Box
          component={motion.div}
          animate={{
            scale: [NUMBER.ONE, NUMBER.ONE_POINT_TWO, NUMBER.ONE_POINT_TWO, NUMBER.ONE, NUMBER.ONE],
            rotate: [0, NUMBER.TWOHUNDRED_SEVENTY, NUMBER.TWOHUNDRED_SEVENTY, 0, 0],
            opacity: [1, NUMBER.ZERO_POINT_TWENTY_FIVE, NUMBER.ZERO_POINT_TWENTY_FIVE, NUMBER.ZERO_POINT_TWENTY_FIVE, 1],
            borderRadius: ['25%', '25%', '50%', '50%', '25%']
          }}
          transition={{
            ease: 'linear',
            duration: 3.2,
            repeat: Infinity
          }}
          sx={{
            width: 120,
            height: 120,
            borderRadius: '25%',
            position: 'absolute',
            border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, NUMBER.ZERO_POINT_TWENTY_FOUR)}`
          }}
        />
      </RootStyle>
    </>
  );
}
