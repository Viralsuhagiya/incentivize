import { alpha } from '@mui/material/styles';
import { NUMBER } from '../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

interface GradientsPaletteOptions {
  primary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

interface ChartPaletteOptions {
  violet: string[];
  blue: string[];
  green: string[];
  yellow: string[];
  red: string[];
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface Palette {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }
  interface PaletteOptions {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }
}

declare module '@mui/material' {
  interface Color {
    0: string;
    500_8: string;
    500_12: string;
    500_16: string;
    500_24: string;
    500_32: string;
    500_48: string;
    500_56: string;
    500_80: string;
  }
}

// SETUP COLORS
const PRIMARY = {
  lighter: '#fae9e7',
  light: '#ffa072',
  main: '#FC6E45',
  dark: '#c33d1a',
  darker: '#a52703'
};

const SECONDARY = {
  lighter: '#ffebee',
  light: '#ff7961',
  main: '#f44336',
  dark: '#ba000d',
  darker: '#8a1008'
};

const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A'
};
const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D'
};
const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01'
};
const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E'
};

const PENDING = {
  light: '#fbb85c',
  main: '#faa734',
  dark: '#af7424',
};

const PAID = {
  light: '#61bf92',
  main: '#3ab077',
  dark: '#287b53',
};

const APPROVED = {
  light: '#16798e',
  main: '#20adcb',
  dark: '#4cbdd5',
};

const CANCELLED = {
  light: '#ff6c67',
  main: '#FF4842',
  dark: '#b2322e',
};


const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8)
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main)
};

const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4']
};
const WHITE = '#FFF';  // #F6F5F0'
const PROPAY_STATUS = {
  pending: {...PENDING, contrastText: WHITE },
  paid: {...PAID, contrastText: WHITE },
  approved: {...APPROVED, contrastText: WHITE },
  cancelled: {...CANCELLED, contrastText: WHITE },
};


const COMMON = {
  common: { black: '#231F20', white: WHITE },
  primary: { ...PRIMARY, contrastText: WHITE },
  secondary: { ...SECONDARY, contrastText: WHITE },
  info: { ...INFO, contrastText: WHITE },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: WHITE },
  ...PROPAY_STATUS,
  grey: GREY,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48
  }
};

const palette = {
  light: {
    ...COMMON,
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    background: { paper: WHITE, default: WHITE, neutral: GREY[NUMBER.TWO_HUNDRED] },
    action: { active: GREY[600], ...COMMON.action }
  },
  dark: {
    ...COMMON,
    text: { primary: WHITE, secondary: GREY[NUMBER.FIFE_HUNDRED], disabled: GREY[NUMBER.SIX_HUNDRED] },
    background: { paper: GREY[800], default: GREY[900], neutral: GREY[500_16] },
    action: { active: GREY[500], ...COMMON.action }
  }
};

export default palette;
