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
      <Avatar 
        icon={Loader2} 
        className="bg-sage-100 text-sage-600 border-sage-200 animate-spin" 
      />
      <div className="bg-sage-50 border border-sage-200 px-6 py-4 rounded-2xl space-y-2 min-w-[200px]">
        <div className="h-4 bg-sage-200/50 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-sage-200/50 rounded animate-pulse w-1/2" />
      </div>
    </motion.div>
  );
};