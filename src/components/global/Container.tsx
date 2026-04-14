import React from 'react';

export const Container = ({
  children,
  classname,
}: {
  classname?: string;
  children: React.ReactNode;
}) => {
  return (
    <section className={`${classname} relative w-full max-w-[1440px] mx-auto`}>{children}</section>
  );
};
