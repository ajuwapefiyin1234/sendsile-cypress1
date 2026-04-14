import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SubtleLoadingIndicator = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Start or continue the progress bar animation
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 0));
      }, 100); // Adjust the speed of progress here

      return () => clearInterval(interval); // Cleanup interval on component unmount or isLoading change
    } else {
      // Reset progress when loading completes
      setProgress(0);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
      <div
        className="h-full bg-[#FFA900] transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

SubtleLoadingIndicator.propTypes = {
  isLoading: PropTypes.bool,
};

export default SubtleLoadingIndicator;
