import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  icon: FC<{ className?: string }>;
  className?: string;
}

export const Avatar: FC<AvatarProps> = ({ icon: Icon, className }) => (
  <div
    className={twMerge(
      "flex items-center justify-center w-10 h-10 rounded-full border border-white/10 shrink-0",
      className
    )}
  >
    <Icon className="w-5 h-5" />
  </div>
);