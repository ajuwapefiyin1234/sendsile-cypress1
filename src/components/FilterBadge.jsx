import { TbX } from 'react-icons/tb';
import PropTypes from 'prop-types';

export const FilterBadge = ({ type, value, onRemove }) => (
  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm">
    <span>{`${type || ''}: ${value || ''}`}</span>
    <button onClick={onRemove} className="text-gray-500 hover:text-gray-700">
      <TbX size={16} />
    </button>
  </div>
);
FilterBadge.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};
