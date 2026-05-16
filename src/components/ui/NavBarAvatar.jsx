import clsx from 'clsx';
import { useAppState } from '../../providers/AppProvider';
import { Avatar } from '../../Profile/Userprofile';

export default function NavBarAvatar({ size = 'md' }) {
      const { user, profile } = useAppState();
      return (
            <Avatar user_avatar={user?.avatar_url || user?.user_metadata?.name[0]} name={user?.full_name || profile?.name} size={30} />
      )
}