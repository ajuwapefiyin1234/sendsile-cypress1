import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useGetUserLocation = () => {
  const [coords, setCoords] = useState({
    long: 0,
    lat: 0,
  });
  useEffect(() => {
    if (navigator.geolocation) {
      (navigator.geolocation.getCurrentPosition((postion) => {
        setCoords({
          long: postion.coords.longitude,
          lat: postion.coords.latitude,
        });
      }),
        (error: any) => {
          toast.error(error?.message || 'Could not get user location', {
            toastId: 'locationError',
            position: 'bottom-left',
          });
        });
    } else {
      toast.error('Could not get user location', {
        toastId: 'locationError',
        position: 'bottom-left',
      });
    }
  }, []);

  return coords;
};

export default useGetUserLocation;
