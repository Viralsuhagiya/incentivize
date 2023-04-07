// material
import { Box, BoxProps } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import LogoImage from '../assets/protiv-logo.svg';
import CollapseLogoImage from '../assets/protiv-logo-icon.svg';

// ----------------------------------------------------------------------

const Logo = ({ sx }: BoxProps) => {
    return (
        <Box className="logo" component={RouterLink} to="/">
            <img src={LogoImage} alt='logo' className='desktoplogo' />  
            <img src={CollapseLogoImage} alt='logo' className='desktop-collapse-logo' />            
            <img src={LogoImage} alt='logo' className='mobileLogo' />            
        </Box>
    );
};

export default Logo;
