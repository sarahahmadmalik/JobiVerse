import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, X } from "lucide-react";

const statusConfig = {
  success: {
    icon: <Check size={20} className="text-gray-800" />,
    iconBg: "#00ED7B",
    outerCircleBg: "#303746",
    gradientStyle: {
      background:
        "linear-gradient(90deg, rgba(0, 237, 123, 0.2) 0%, rgba(0, 237, 123, 0.05) 50%, rgba(0, 237, 123, 0) 100%)",
    },
    backgroundColor: "rgba(30, 58, 52, 1)",
  },
  warning: {
    icon: <AlertTriangle size={16} className="text-gray-800" />,
    iconBg: "#FFD028",
    outerCircleBg: "#303746",
    gradientStyle: {
      background:
        "radial-gradient(circle 90deg, rgba(255, 208, 40, 0.2) 0%, rgba(255, 208, 40, 0.05) 50%, rgba(255, 208, 40, 0) 100%)",
    },
    backgroundColor: "rgba(58, 52, 30, 1)",
  },
  error: {
    icon: <X size={16} className="text-gray-800 " />,
    iconBg: "#FF3B30",
    outerCircleBg: "#303746",
    gradientStyle: {
      background:
        "linear-gradient(90deg, rgba(255, 59, 48, 0.2) 0%, rgba(255, 59, 48, 0.05) 50%, rgba(255, 59, 48, 0) 100%)",
    },
    backgroundColor: "rgba(58, 30, 30, 1)",
  },
};

const toastVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const Toast = ({
  type = "success",
  title,
  message,
  onClose,
  duration = 4000,
}) => {
  const config = statusConfig[type] || statusConfig.success;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={toastVariants}
        className="relative w-full toast-font min-w-[380px] h-[85px] max-w-md mb-4"
      >
        <div
          className="rounded-xl shadow-lg py-4 px-4 border overflow-hidden text-white flex items-center relative"
          style={{
            background: `linear-gradient(90deg, ${config.backgroundColor} 0%, #242C32 50%, #1C2127 100%)`,
          }}
        >
          {/* Radial Gradient Overlay */}
          <div
            className="absolute z-40 inset-0 left-[-20] opacity-20"
            style={config.gradientStyle}
          ></div>

          {/* Icon */}
          <div className="relative z-0 ml-2 flex items-center justify-center">
            <div
              className="h-9 w-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: config.outerCircleBg }}
            >
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: config.iconBg }}
              >
                {config.icon}
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="relative z-10 ml-4 flex-1 flex flex-col items-start justify-center">
            <h3 className="text-[17px] font-[500]">{title}</h3>
            <p className="text-[13px] text-[#C8C5C5] font-[400] max-w-[280px] mt-[2px]">
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute z-40 top-3 right-3 text-white opacity-50 hover:opacity-100 transition"
          >
            ✖
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
