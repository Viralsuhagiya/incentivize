import { Theme } from '@mui/material/styles';
import { NUMBER } from '../../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

export default function DataGrid(theme: Theme) {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid transparent`,
          '& .MuiTablePagination-root': {
            borderTop: 0
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: theme.spacing(NUMBER.TWO),
            backgroundColor: theme.palette.background.neutral,
            '& .MuiButton-root': {
              marginRight: theme.spacing(NUMBER.ONE_POINT_FIVE),
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }
          },
          '& .MuiDataGrid-cell, .MuiDataGrid-columnsContainer': {
            borderBottom: `1px solid ${theme.palette.divider}`
          },
          '& .MuiDataGrid-columnSeparator': {
            color: theme.palette.divider
          },
          '& .MuiDataGrid-columnHeader[data-field="__check__"]': {
            padding: 0
          }
        }
      }
    },
    MuiGridMenu: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-gridMenuList': {
            boxShadow: theme.customShadows.z20,
            borderRadius: theme.shape.borderRadius
          },
          '& .MuiMenuItem-root': {
            ...theme.typography.body2
          }
        }
      }
    },
    MuiGridFilterForm: {
      styleOverrides: {
        root: {
          padding: theme.spacing(NUMBER.ONE_POINT_FIVE, 0),
          '& .MuiFormControl-root': {
            margin: theme.spacing(0, NUMBER.ZERO_POINT_FIVE)
          },
          '& .MuiInput-root': {
            marginTop: theme.spacing(NUMBER.THREE),
            '&::before, &::after': {
              display: 'none'
            },
            '& .MuiNativeSelect-select, .MuiInput-input': {
              ...theme.typography.body2,
              padding: theme.spacing(0.75, 1),
              borderRadius: theme.shape.borderRadius,
              backgroundColor: theme.palette.background.neutral
            },
            '& .MuiSvgIcon-root': {
              right: 4
            }
          }
        }
      }
    },
    MuiGridPanelFooter: {
      styleOverrides: {
        root: {
          padding: theme.spacing(NUMBER.TWO),
          justifyContent: 'flex-end',
          '& .MuiButton-root': {
            '&:first-of-type': {
              marginRight: theme.spacing(NUMBER.ONE_POINT_FIVE),
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            },
            '&:last-of-type': {
              color: theme.palette.common.white,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }
          }
        }
      }
    }
  };
}
