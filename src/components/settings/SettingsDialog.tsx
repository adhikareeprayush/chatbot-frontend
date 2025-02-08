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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 w-full max-w-md z-50"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-sage-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-sage-800">
                  Settings
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-sage-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-sage-600" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* AI Personality */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-sage-600" />
                    </div>
                    <label className="text-lg font-medium text-sage-800">
                      AI Personality
                    </label>
                  </div>
                  <select
                    value={settings.aiPersonality}
                    onChange={(e) => updateSettings({ aiPersonality: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 bg-white focus:ring-2 focus:ring-sage-500 focus:border-transparent"
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
                    <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center">
                      <Layout className="w-4 h-4 text-sage-600" />
                    </div>
                    <label className="text-lg font-medium text-sage-800">
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
                            ? 'border-sage-600 bg-sage-50 text-sage-800'
                            : 'border-sage-200 hover:border-sage-400 text-sage-600'
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
                    <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-sage-600" />
                    </div>
                    <label className="text-lg font-medium text-sage-800">
                      Code Display
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-sage-200 hover:border-sage-400 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={settings.codeBlocks.syntax}
                        onChange={(e) => 
                          updateSettings({
                            codeBlocks: { ...settings.codeBlocks, syntax: e.target.checked }
                          })
                        }
                        className="rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                      />
                      <div>
                        <span className="font-medium text-sage-800">Syntax Highlighting</span>
                        <p className="text-sm text-sage-600">Colorize code for better readability</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-sage-200 hover:border-sage-400 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={settings.codeBlocks.lineNumbers}
                        onChange={(e) => 
                          updateSettings({
                            codeBlocks: { ...settings.codeBlocks, lineNumbers: e.target.checked }
                          })
                        }
                        className="rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                      />
                      <div>
                        <span className="font-medium text-sage-800">Line Numbers</span>
                        <p className="text-sm text-sage-600">Show line numbers in code blocks</p>
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