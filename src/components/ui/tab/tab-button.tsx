export const TabButton = ({
  classname,
  text,
  handleClick,
}: {
  classname: string;
  text: string;
  handleClick: () => void;
}) => {
  return (
    <button onClick={handleClick} className={classname}>
      {text}
    </button>
  );
};
