import { PropsWithChildren, useEffect } from 'react';
import { ROUTES } from '../../utils/route-constants';
import { getTokenExpiry } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

const TokenActive = (props: PropsWithChildren) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('__user_access')
        ? localStorage.getItem('__user_access')
        : null;
      const isExpired = getTokenExpiry(token as string);

      if (isExpired !== true) {
        return navigate(ROUTES.dashboard, { replace: true });
      }
    }
  }, [navigate]);

  return props.children;
};

export default TokenActive;
