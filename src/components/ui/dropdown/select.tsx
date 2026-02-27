export const Select = ({ classname }: { classname: string }) => {
  return <div className={`${classname}`}></div>;
};

export const SelectItem = ({ classname, children }: { classname: string; children: string }) => {
  return <button className={`${classname} relative`}>{children}</button>;
};
