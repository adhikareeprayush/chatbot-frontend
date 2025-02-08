import { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar } from '../common/Avatar';

export const LoadingMessage: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-start gap-4 px-4"
    >
      <Avatar icon={Loader2} className="bg-surface/50 animate-spin" />
      <div className="glass-effect px-6 py-4 rounded-2xl space-y-2 min-w-[200px]">
        <div className="h-4 bg-surface/50 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-surface/50 rounded animate-pulse w-1/2" />
      </div>
    </motion.div>
  );
};