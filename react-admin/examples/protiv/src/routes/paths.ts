// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}
const ROOTS_AUTH = '';
const ROOTS_DASHBOARD = '/overview';
const ROOTS_PROPAY = '/propay';
const ROOTS_TECHNICAL = '/technical';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify'),
};

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  payroll: '/payroll',
  jobs:'/jobs',
  team: '/team',
  reports: '/reports',
  settings: '/settings',
  technical: '/technical',
  app: {
    root: path(ROOTS_DASHBOARD, '/app'),
    pageFour: path(ROOTS_DASHBOARD, '/app/four'),
    pageFive: path(ROOTS_DASHBOARD, '/app/five'),
    pageSix: path(ROOTS_DASHBOARD, '/app/six'),
  },
};

export const PATH_PROPAY = {
  root: ROOTS_PROPAY,
  list: path(ROOTS_PROPAY, '/list'),
};

export const PATH_TECHNICAL = {
  root: ROOTS_TECHNICAL,
  company: {
    root: '/company',
    list: '/company/list',
  },
  customfield: {
    root: '/customfield',
    list: '/customfield/list',
  },
};
