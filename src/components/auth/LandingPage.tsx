import { FC } from 'react';
import { Bot, MessageSquare, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const LandingPage: FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-sage-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-sage-100/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-sage-100/10 rounded-full"
            initial={{ x: Math.random() * 100, y: Math.random() * 100 }}
            animate={{
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-sage-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-sage-900">AI Assistant</span>
          </div>
          <button
            onClick={onSignIn}
            className="px-6 py-2 text-sage-700 hover:text-sage-900 font-medium transition-colors"
          >
            Sign In
          </button>
        </nav>

        <main className="container mx-auto px-4 pt-16 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative inline-block"
            >
              <h1 className="text-6xl font-bold text-sage-900 mb-6 relative z-10">
                Your Intelligent
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-sage-600 to-sage-800 text-transparent bg-clip-text"> AI Companion</span>
                  <motion.svg
                    viewBox="0 0 300 20"
                    className="absolute -bottom-2 left-0 w-full"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <motion.path
                      d="M 0 10 C 50 0, 250 0, 300 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-sage-400"
                    />
                  </motion.svg>
                </span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-sage-700 mb-12"
            >
              Experience natural, context-aware discussions powered by advanced AI technology
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4"
            >
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-sage-600 text-white rounded-2xl font-medium hover:bg-sage-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-24"
          >
            <Feature
              icon={MessageSquare}
              title="Natural Conversations"
              description="Engage in fluid, context-aware discussions that feel natural and meaningful"
            />
            <Feature
              icon={Sparkles}
              title="Smart Responses"
              description="Get intelligent, relevant answers powered by advanced AI technology"
            />
            <Feature
              icon={Lock}
              title="Secure & Private"
              description="Your conversations are protected with enterprise-grade security"
            />
          </motion.div>
        </main>
      </div>
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
    whileHover={{ y: -5 }}
    className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sage-100"
  >
    <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-sage-600" />
    </div>
    <h3 className="text-lg font-semibold text-sage-900 mb-2">{title}</h3>
    <p className="text-sage-600">{description}</p>
  </motion.div>
);