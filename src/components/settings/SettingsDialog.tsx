import { FC } from 'react';
import { X, Layout, MessageSquare, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog: FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 w-full max-w-md z-50"
          >
            <div className="glass-card p-6 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">
                  Customize Experience
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                {/* AI Personality */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-primary-light" />
                    </div>
                    <label className="text-lg font-medium">
                      AI Personality
                    </label>
                  </div>
                  <select
                    value={settings.aiPersonality}
                    onChange={(e) => updateSettings({ aiPersonality: e.target.value as any })}
                    className="input w-full"
                  >
                    <option value="default">Balanced Assistant</option>
                    <option value="professional">Professional Expert</option>
                    <option value="friendly">Friendly Helper</option>
                    <option value="concise">Concise Advisor</option>
                  </select>
                </div>

                {/* Response Format */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Layout className="w-4 h-4 text-primary-light" />
                    </div>
                    <label className="text-lg font-medium">
                      Response Format
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['default', 'bullet', 'paragraph', 'stepByStep'].map((format) => (
                      <button
                        key={format}
                        onClick={() => updateSettings({ responseFormat: format as any })}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          settings.responseFormat === format
                            ? 'border-primary bg-primary/10'
                            : 'border-white/10 hover:border-primary/50'
                        }`}
                      >
                        <span className="capitalize">{format.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Blocks */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary-light" />
                    </div>
                    <label className="text-lg font-medium">
                      Code Display
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-primary/50 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={settings.codeBlocks.syntax}
                        onChange={(e) => 
                          updateSettings({
                            codeBlocks: { ...settings.codeBlocks, syntax: e.target.checked }
                          })
                        }
                        className="rounded border-white/20 bg-surface/50 text-primary focus:ring-primary"
                      />
                      <div>
                        <span className="font-medium">Syntax Highlighting</span>
                        <p className="text-sm text-text-secondary">Colorize code for better readability</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-primary/50 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={settings.codeBlocks.lineNumbers}
                        onChange={(e) => 
                          updateSettings({
                            codeBlocks: { ...settings.codeBlocks, lineNumbers: e.target.checked }
                          })
                        }
                        className="rounded border-white/20 bg-surface/50 text-primary focus:ring-primary"
                      />
                      <div>
                        <span className="font-medium">Line Numbers</span>
                        <p className="text-sm text-text-secondary">Show line numbers in code blocks</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};