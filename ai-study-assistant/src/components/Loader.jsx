import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-2xl">
        <div className="flex gap-1">
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="w-2 h-2 bg-slate-400 rounded-full"
          />
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
            className="w-2 h-2 bg-slate-400 rounded-full"
          />
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
            className="w-2 h-2 bg-slate-400 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;