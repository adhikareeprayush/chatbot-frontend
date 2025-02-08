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
        <div className="w-24 h-24 rounded-3xl bg-sage-100/20 border border-sage-200/30 flex items-center justify-center mb-8 animate-float">
          <Bot className="w-12 h-12 text-sage-600" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-sage-100/20 border border-sage-200/30 flex items-center justify-center animate-pulse">
          <div className="w-3 h-3 rounded-full bg-sage-600" />
        </div>
      </motion.div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl"
      >
        <motion.div variants={item}>
          <h2 className="text-3xl font-bold mb-4 text-sage-800">
            Welcome to AI Assistant
          </h2>
          
          <p className="text-sage-600 text-lg mb-12 max-w-md mx-auto">
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
    className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center mb-4 mx-auto">
      <Icon className="w-6 h-6 text-sage-600" />
    </div>
    <h3 className="font-semibold text-lg mb-2 text-sage-800">{title}</h3>
    <p className="text-sm text-sage-600">{description}</p>
  </motion.div>
);