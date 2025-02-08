import { FC } from 'react';
import { Bot, MessageSquare, Zap, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const EmptyState: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-8 animate-float">
          <Bot className="w-12 h-12 text-primary-light" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-success/20 border border-success/30 flex items-center justify-center animate-pulse">
          <div className="w-3 h-3 rounded-full bg-success" />
        </div>
      </motion.div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl"
      >
        <motion.div variants={item}>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">
            Welcome to AI Assistant
          </h2>
          
          <p className="text-text-secondary text-lg mb-12 max-w-md mx-auto">
            Your intelligent companion for productive conversations. Ask anything!
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          <Feature
            icon={MessageSquare}
            title="Natural Chat"
            description="Engage in fluid, context-aware discussions"
          />
          <Feature
            icon={Zap}
            title="Quick Responses"
            description="Get instant, accurate answers"
          />
          <Feature
            icon={Code}
            title="Code Support"
            description="Get help with programming"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

interface FeatureProps {
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
}

const Feature: FC<FeatureProps> = ({ icon: Icon, title, description }) => (
  <motion.div 
    variants={item}
    className="glass-effect p-6 rounded-2xl hover:bg-surface/50 transition-colors duration-300"
  >
    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 mx-auto">
      <Icon className="w-6 h-6 text-primary-light" />
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-text-secondary">{description}</p>
  </motion.div>
);