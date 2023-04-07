import { MAvatar } from './@material-extend';
import { MAvatarProps } from './@material-extend/MAvatar';
import createAvatar from '../utils/createAvatar';
import { useIdentityContext } from './identity';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }: MAvatarProps) {
  const identity = useIdentityContext();
  return (
    <MAvatar
      src={identity?.avatar}
      alt={identity?.fullName}
      color={identity?.avatar ? 'default' : createAvatar(identity?.fullName||'').color}
      {...other}
    >
      {createAvatar(identity?.fullName||'').name}
    </MAvatar>
  );
}
