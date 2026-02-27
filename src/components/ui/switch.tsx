export const Switch = ({
  switchState,
  handle2FactorAuth,
}: {
  switchState: boolean;
  handle2FactorAuth: () => void;
}) => {
  return (
    <div
      className={`z-20 relative min-w-[34px] h-[14px] ${
        switchState ? 'bg-prm-red' : 'bg-[#E3E6ED]'
      } rounded-full transition-all duration-300`}
    >
      <label
        htmlFor="switch"
        className={`rounded-full absolute top-1/2 -translate-y-1/2 size-5 shadow-[#00000024] shadow-md ${
          switchState ? 'translate-x-[80%]' : 'translate-x-0'
        } transition-all duration-300 cursor-pointer  bg-white`}
      ></label>
      <input
        type="checkbox"
        onChange={handle2FactorAuth}
        id="switch"
        checked={switchState}
        className="hidden"
      />
    </div>
  );
};
