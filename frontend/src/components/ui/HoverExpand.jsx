// frontend/src/components/ui/HoverExpand.jsx
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { cn } from "../../lib/utils";

// Main Hover Expand Component
const HoverExpand = ({ images, className }) => {
  // Default ga first image (index 0) active ga untundi
  const [activeImage, setActiveImage] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn("relative w-full max-w-7xl mx-auto px-2 sm:px-5 my-8", className)}
    >
      <div className="w-full">
        <div className="flex w-full items-center justify-center gap-1 sm:gap-2">
          {images.map((item, index) => (
            <motion.div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg border border-white/10 bg-[#13131A]"
              // Mobile lo chinna size, Desktop lo pedda size untundi
              initial={{ width: "2rem", height: "15rem" }}
              animate={{
                width: activeImage === index ? "100%" : "3rem",
                height: activeImage === index ? "20rem" : "20rem", // Height fix chesam
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              onHoverStart={() => setActiveImage(index)}
              onClick={() => setActiveImage(index)}
            >
              
              {/* Dark Gradient Overlay only on Active Image */}
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute h-full w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"
                  />
                )}
              </AnimatePresence>

              {/* Text Info on Active Image */}
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.2 }}
                    className="absolute flex h-full w-full flex-col items-start justify-end p-4 sm:p-6 z-20"
                  >
                    <p className="text-left text-lg sm:text-xl font-bold text-white tracking-wide">
                      {item.name}
                    </p>
                    <p className="text-left text-sm text-yellow-400 font-semibold mt-1">
                      {item.price}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Actual Product Image */}
              <img
                src={item.image[0]} 
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
                alt={item.name}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HoverExpand;