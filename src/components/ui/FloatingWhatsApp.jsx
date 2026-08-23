import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FloatingWhatsApp() {
  const { settings } = useApp();
  const [show, setShow] = useState(false);
  const phone = settings.contactInfo?.whatsapp?.replace(/\D/g, '') || '';
  const message = encodeURIComponent("Hi! I'd like to place an order from STARVING 🍔👑");
  const waUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-40 flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1a2c20] border border-green-500/30 rounded-2xl p-3 shadow-xl max-w-[220px]"
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-2 right-2 text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={12} />
            </button>
            <p className="text-white text-xs font-semibold mb-1">Chat with us! 💬</p>
            <p className="text-white/55 text-xs mb-3">
              Order now or ask us anything on WhatsApp.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 w-full justify-center bg-green-500 hover:bg-green-400 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all"
            >
              <MessageCircle size={13} /> Open WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => setShow(s => !s)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' }}
        aria-label="Chat on WhatsApp"
        id="whatsapp-fab"
      >
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'rgba(37,211,102,0.35)' }}
          animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        <MessageCircle size={26} className="text-white" fill="white" />
      </motion.button>
    </div>
  );
}
