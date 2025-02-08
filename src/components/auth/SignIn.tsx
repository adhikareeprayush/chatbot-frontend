import { FC, useState } from 'react';
import { Bot, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface SignInProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: () => void;
}

export const SignIn: FC<SignInProps> = ({ onLogin, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-sage-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Bot className="w-12 h-12 text-sage-700 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-sage-900 mb-2">Welcome back</h1>
            <p className="text-sage-600">Sign in to continue your conversation</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sage-700 text-white rounded-lg font-medium hover:bg-sage-800 transition-colors"
              >
                Sign In
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-sage-600">
            Don't have an account?{' '}
            <button
              onClick={onSignUp}
              className="text-sage-700 hover:text-sage-900 font-medium"
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};