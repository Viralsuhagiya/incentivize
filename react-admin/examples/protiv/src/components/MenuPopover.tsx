// material
import { alpha, styled } from '@mui/material/styles';
import { Popover, PopoverProps } from '@mui/material';
import { NUMBER } from '../utils/Constants/MagicNumber';

const ArrowStyle = styled('span')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    top: -7,
    zIndex: 1,
    width: 12,
    right: 20,
    height: 12,
    content: "''",
    position: 'absolute',
    borderRadius: '0 0 4px 0',
    transform: 'rotate(-135deg)',
    background: theme.palette.background.paper,
    borderRight: `solid 1px ${alpha(theme.palette.grey[NUMBER.FIFE_HUNDRED], NUMBER.ZERO_POINT_ONE_TWO)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[NUMBER.FIFE_HUNDRED], NUMBER.ZERO_POINT_ONE_TWO)}`
  }
}));


export default function MenuPopover({ children, sx, ...other }: PopoverProps) {
  return (
    <Popover
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      PaperProps={{
        sx: {
          mt: 1,
          ml: 15.5,
          overflow: 'inherit',
          boxShadow: (theme) => theme.customShadows.z20,
          border: (theme) => `solid 1px ${theme.palette.grey[500_8]}`,
          width: 200,
          ...sx
        }
      }}
      {...other}
    >
      <ArrowStyle />

      {children}
    </Popover>
  );
}
