import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
// components
import Logo from '../components/Logo';
import { MHidden } from '../components/@material-extend';
import AuthLogoImage from '../assets/auth-protiv-logo.svg';
import { NUMBER } from '../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(NUMBER.THREE),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(NUMBER.SEVEN, NUMBER.FIVE, 0, NUMBER.SEVEN)
  }
}));

// ----------------------------------------------------------------------

type AuthLayoutProps = {
  children?: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <HeaderStyle>
      <RouterLink to="/">
        {/* <Logo /> */}
        <div className='onborading-logo'>
        <img src={AuthLogoImage} alt='logo' />          
      </div>
      </RouterLink>

      <MHidden width="smDown">
        <Typography
          variant="body2"
          sx={{
            mt: { md: -2 }
          }}
        >
          {children}
        </Typography>
      </MHidden>
    </HeaderStyle>
  );
}
