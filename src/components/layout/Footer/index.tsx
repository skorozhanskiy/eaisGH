import React from 'react';

interface Props {
  className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
  return <footer className={className}></footer>;
};
