import { useStore } from '@/store/store';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import PropTypes from 'prop-types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logout, logoutAllSession } from '@/utils/queries';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const LogoutOutDialog = ({ logOutDialog, setLogOutDialog }) => {
  const location = useLocation();
  // Determine if the route is for the super admin
  const isSuperAdmin = location.pathname.includes('super-admin');
  const { logoutUser } = useStore((state) => state.authActions);

  const logoutMutation = useMutation({
    mutationFn: () => logout(isSuperAdmin),
    onSuccess: () => {
      toast.success('Logged out successfully');
      logoutUser();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || error?.message || 'Failed to logout'
      );
      logoutUser();
    },
  });

  const logoutAllSessionsMutation = useMutation({
    mutationFn: logoutAllSession,
    onSuccess: () => {
      toast.success('Logged out from all sessions');
      logoutUser();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to logout from all sessions'
      );
      logoutUser();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleLogoutAllSessions = () => {
    logoutAllSessionsMutation.mutate();
  };

  return (
    <Dialog open={logOutDialog} onOpenChange={setLogOutDialog}>
      <DialogContent className="sm:max-w-[426px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-[22px] leading-[31px] text-[#45464E]">
            Logout
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 w-full max-w-[504px] border-t-[0.5px] pt-6 mt-2 border-[#ECEEF4] max-h-[calc(100dvh-50px)]  overflow-y-auto">
          <div className="flex  flex-col items-start gap-4">
            <p className="text-[15px] leading-[21px] text-[#3645F] grow">
              Are you sure you want to logout?
            </p>
          </div>

          <div className="flex items-start gap-1 w-full">
            <Button
              type="button"
              varaint="secondary"
              disabled={
                logoutMutation.isPending || logoutAllSessionsMutation.isPending
              }
              onClick={() => setLogOutDialog(false)}
              className="p-4 w-full h-[54px] rounded-[32px] bg-[#FCFBFA] font-bold text-[17px] leading-[23.8px] text-[#00070C] hover:text-white border border-[#5F5F5F] grow"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleLogout}
              disabled={
                logoutMutation.isPending || logoutAllSessionsMutation.isPending
              }
              className="p-4 w-full h-[54px] rounded-[32px] bg-[#00070C] font-bold text-[16px] leading-[22.4px] text-white"
            >
              {logoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                'Logout'
              )}
            </Button>
          </div>
          <div className="w-full justify-end items-center flex">
            <p
              onClick={handleLogoutAllSessions}
              className="text-red-600 cursor-pointer hover:underline"
            >
              {logoutAllSessionsMutation.isPending
                ? 'Logging out all...'
                : 'Logout from all sessions'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

LogoutOutDialog.propTypes = {
  setLogOutDialog: PropTypes.func.isRequired,
  logOutDialog: PropTypes.bool,
};

export default LogoutOutDialog;
