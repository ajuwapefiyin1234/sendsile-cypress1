import PropTypes from 'prop-types';


const PreLoader = ({ className, width }) => {
  return (
    <span className={`block p-2 bg-gray-200 animate-pulse rounded-lg ` + className + " " + width}></span>
  );
};

PreLoader.propTypes = {
  className: PropTypes.string,
  width: PropTypes.string,
};

export default PreLoader;