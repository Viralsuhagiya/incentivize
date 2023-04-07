// material
import { styled } from '@mui/material/styles';
import {useCallback, useState} from 'react';

import { Box, Stack, Button, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// components

import { Policy } from '../policies';


// ----------------------------------------------------------------------

const FrameStyle= styled(Box)(({ theme }) => ({
  height:'100%',
  borderWidth:0,
  padding:theme.spacing(1),  
  overflow:'scroll',
}));
// ----------------------------------------------------------------------

export const StyledDialog = styled(Dialog)({
  '.MuiDialogContent-root': {
      height: window.innerHeight,
  },
});

export const TermsDialog = ({title, show, handleDecline, handleAccept, label, type}: any) => {
  return (
      <StyledDialog fullWidth maxWidth='lg' open={show} >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title" sx={{pb:2,pt:2}}>
              <Stack flexDirection={'row'} justifyContent={'center'}>
                  {title}
              </Stack>
          </DialogTitle>
          <DialogContent sx={{p:0, scrollBehavior:'unset'}}>
            <FrameStyle>
              {/* <StyledIFrame src={url} title="" width="100%" height="100%"/> */}
              <Policy label={label} type={type}/>
            </FrameStyle>
          </DialogContent>
          <DialogActions sx={{justifyContent:'center'}}>
            <Button
              onClick={handleDecline}
              size="medium"
              variant="outlined"
              sx={{mr:3,borderRadius:40}}
            >
              Decline
              </Button>            
              <Button
                onClick={handleAccept}
                size="medium"
                variant="contained"
                sx={{borderRadius:40}}
            >
              Accept
            </Button>            
          </DialogActions>          
      </StyledDialog>
  );
};

export const AcceptTermsAndConditions = (props:any) => {
  const {value, setValue, name, label,type, ...rest} = props
  const [show, setShow] = useState(false);
  const handleChangeTerms = useCallback((event)=>{
    setShow(true);
  },[setShow])
  const handleDecline = useCallback((event)=>{
    setShow(false);
    setValue(false);
  },[setValue,setShow]);  
  
  const handleAccept = useCallback((event)=>{
    setShow(false);
    setValue(true);
  },[setValue,setShow]);  
  return (<>
      <FormControlLabel
          control={
            <Checkbox checked={value} onChange={handleChangeTerms} name={name} />
          }
          label={label}
          {...rest}
        />
        <TermsDialog show={show} title={label} handleDecline={handleDecline} handleAccept={handleAccept} label={label} type={type}/>

  </>);
}
