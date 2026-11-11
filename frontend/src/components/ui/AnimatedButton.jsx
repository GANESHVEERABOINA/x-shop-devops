// frontend/src/components/ui/AnimatedButton.jsx
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils"; // Path correct ga set chesanu

const AnimatedButton = ({
  children = "Browse Components",
  className = "",
  as = "button",
  ...rest
}) => {
  const Component = motion[as] || motion.button;

  return (
    <Component
      {...rest}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      }}
      className={cn(
        "group inline-flex items-center justify-center px-8 py-3 rounded-full relative overflow-hidden bg-white text-black border border-white/20 shadow-lg",
        "font-bold text-sm tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50",
        "[--shine:rgba(0,0,0,.15)] hover:bg-gray-100", // Adapted for our Dark theme UI
        className
      )}
    >
      {/* Text with shine mask */}
      <motion.span
        className="flex items-center justify-center h-full w-full relative z-10"
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg, black calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), black calc(var(--mask-x) + 100%))",
          maskImage:
            "linear-gradient(-75deg, black calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), black calc(var(--mask-x) + 100%))",
        }}
        initial={{ "--mask-x": "100%" }}
        animate={{ "--mask-x": "-100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
          repeatDelay: 1,
        }}
      >
        {children}
      </motion.span>

      {/* Border shine effect */}
      <motion.span
        className="block absolute inset-0 rounded-full p-px pointer-events-none"
        style={{
          background:
            "linear-gradient(-75deg, transparent 30%, var(--shine) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
        initial={{ backgroundPosition: "100% 0", opacity: 0 }}
        animate={{ backgroundPosition: ["100% 0", "0% 0"], opacity: [0, 1, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1,
        }}
      />
    </Component>
  );
};

export default AnimatedButton;