import { Checkbox } from "@/components/ui/checkbox";
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Label } from '@/components/ui/label';
import { replaceSpace } from '@/lib/action';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPreferences, savePreferences } from '@/utils/queries';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const NotificationPreference = ({
  title,
  emailChecked,
  pushChecked,
  onEmailChange,
  onPushChange,
  disabled,
}) => (
  <div className="flex flex-col gap-4 px-4 w-full">
    <h3 className="font-medium text-[15px] leading-[21px] text-[#45464E]">
      {title}
    </h3>
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center gap-5 w-full">
        <Label
          htmlFor={`${replaceSpace(title)}emailNotification`}
          className="text-[15px] leading-[21px] text-[#8B8D97] grow font-normal cursor-pointer"
        >
          Email notifications
        </Label>
        <Checkbox
          id={`${replaceSpace(title)}emailNotification`}
          className="w-5 h-5"
          checked={emailChecked}
          onCheckedChange={onEmailChange}
          disabled={disabled}
        />
      </div>
      <div className="flex justify-between items-center gap-5 w-full">
        <Label
          htmlFor={`${replaceSpace(title)}pushNotification`}
          className="text-[15px] leading-[21px] text-[#8B8D97] grow font-normal cursor-pointer"
        >
          Push notifications
        </Label>
        <Checkbox
          id={`${replaceSpace(title)}pushNotification`}
          className="w-5 h-5"
          checked={pushChecked}
          onCheckedChange={onPushChange}
          disabled={disabled}
        />
      </div>
    </div>
  </div>
);

NotificationPreference.propTypes = {
  title: PropTypes.string.isRequired,
  emailChecked: PropTypes.bool,
  pushChecked: PropTypes.bool,
  onEmailChange: PropTypes.func.isRequired,
  onPushChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

// NotificationPreference.defaultProps = {
//   emailChecked: false,
//   pushChecked: false,
//   disabled: false,
// };

const NotificationTab = () => {
  const location = useLocation();
  // Determine if the route is for the super admin
  const isSuperAdmin = location.pathname.includes('super-admin');
  const queryClient = useQueryClient();
  const [localPreferences, setLocalPreferences] = useState([
    { title: 'New orders', event: 'new_order', email: false, push: false },
    {
      title: 'Order update',
      event: 'order_updated',
      email: false,
      push: false,
    },
    {
      title: 'Order cancellations',
      event: 'order_cancelled',
      email: false,
      push: false,
    },
    {
      title: 'Low stock alerts',
      event: 'low_stock',
      email: false,
      push: false,
    },
    {
      title: 'Out of stock alerts',
      event: 'out_of_stock',
      email: false,
      push: false,
    },
    {
      title: 'New device logins',
      event: 'new_device',
      email: false,
      push: false,
    },
    {
      title: 'Password changes',
      event: 'password_changed',
      email: false,
      push: false,
    },
  ]);

  const {
    data: preferences,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['preferences', isSuperAdmin],
    queryFn: () => fetchPreferences(isSuperAdmin),
  });

  const mutation = useMutation({
    mutationFn: (data) => savePreferences(data, isSuperAdmin),
    onSuccess: () => {
      queryClient.invalidateQueries(['preferences']);
      toast.success('Preferences saved successfully');
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Error saving preferences'
      );
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Network error'
      );
    }
  }, [error]);

  useEffect(() => {
    if (preferences && Array.isArray(preferences)) {
      setLocalPreferences((prevPreferences) =>
        prevPreferences.map((pref) => {
          const fetchedPref = preferences.find((p) => p.event === pref.event);
          return fetchedPref ? { ...pref, ...fetchedPref } : pref;
        })
      );
    }
  }, [preferences]);

  const handlePreferenceChange = (event, type, checked) => {
    setLocalPreferences((prev) =>
      prev.map((pref) =>
        pref.event === event ? { ...pref, [type]: !!checked } : pref
      )
    );
  };

  const handleSaveChanges = () => {
    const formattedPreferences = {
      preferences: localPreferences.map((pref) => ({
        event: pref.event,
        email: !!pref.email,
        push: !!pref.push,
      })),
    };
    const submissionPromise = new Promise((resolve, reject) => {
      mutation.mutate(formattedPreferences, {
        onSuccess: (data) => {
          resolve(data);
        },
        onError: (error) => {
          reject(error);
        },
      });
    });

    toast.promise(submissionPromise, {
      loading: 'Saving preferences...',
      success: () => 'Preferences saved',
      error: (error) =>
        `Error: ${
          error?.response?.data?.message ||
          error.message ||
          'Something went wrong'
        }`,
    });
  };

  return (
    <section className="flex flex-col items-start bg-white rounded-[8px] p-6 gap-8 w-full">
      <div className="grid grid-cols-5 w-full gap-8">
        <div className="md:col-span-4 col-span-4 gap-5 grid w-full grid-cols-3">
          <div className="col-span-1">
            <h2 className="font-medium text-[16px] leading-[22px] text-[#45464E]">
              Notification Preference
            </h2>
          </div>
          <p className="col-span-2 px-4 text-[15px] leading-[21px] font-medium text-[#45464E]">
            You can enable or disable receiving notifications for the following
            cases:
          </p>
          <div>
            <React.Fragment></React.Fragment>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading preferences...
            </div>
          ) : (
            <div className="col-span-2 grid gap-5">
              {localPreferences.map((notification) => (
                <NotificationPreference
                  key={notification.event}
                  title={notification.title}
                  emailChecked={!!notification.email}
                  pushChecked={!!notification.push}
                  onEmailChange={(checked) =>
                    handlePreferenceChange(notification.event, 'email', checked)
                  }
                  onPushChange={(checked) =>
                    handlePreferenceChange(notification.event, 'push', checked)
                  }
                  disabled={isLoading || mutation.isLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-5 w-full gap-8">
        <div className="col-span-3"></div>
        <div className="col-span-1 flex items-center justify-end">
          <Button
            onClick={handleSaveChanges}
            className="py-3 px-4 border border-b border-[#ECEEF4] rounded-[32px] font-medium text-[15px] leading-[21px] text-white"
            disabled={isLoading || mutation.isLoading}
          >
            {mutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotificationTab;
