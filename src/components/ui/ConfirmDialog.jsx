import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card w-full max-w-sm p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${danger ? 'bg-red-500/20' : 'bg-brand-gold/20'}`}>
                <AlertTriangle size={20} className={danger ? 'text-red-400' : 'text-brand-gold'} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-base mb-1">{title}</h3>
                <p className="text-sm text-white/60">{message}</p>
              </div>
              <button onClick={onCancel} className="text-white/40 hover:text-white/70 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={onCancel} className="btn-outline-gold text-xs py-2 px-4">Cancel</button>
              <button
                onClick={onConfirm}
                className={`text-xs py-2 px-4 rounded-lg font-semibold transition-all ${
                  danger
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    : 'btn-gold'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
