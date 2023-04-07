import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
// components
import Logo from '../components/Logo';
import { NUMBER } from '../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(NUMBER.THREE, NUMBER.THREE, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(NUMBER.FIVE, NUMBER.FIVE, 0)
  }
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  return (
    <>
      <HeaderStyle>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
      </HeaderStyle>
    </>
  );
}
