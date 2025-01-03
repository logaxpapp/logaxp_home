// Decorations.tsx
import React from "react";
import { motion } from "framer-motion";
import { CrossSVG, StarSVG } from "./SVGDecorations";

export interface Decoration {
  type: "star" | "cross";
  top: string;
  left: string;
  size: string;
  opacity: string;
}

interface DecorationsProps {
  decorations: Decoration[];
}

const Decorations: React.FC<DecorationsProps> = ({ decorations }) => (
  <>
    {decorations.map((decoration, index) => (
      <motion.div
        key={index}
        className={`absolute ${decoration.opacity} ${decoration.size}`}
        style={{ top: decoration.top, left: decoration.left }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      >
        {decoration.type === "star" ? <StarSVG /> : <CrossSVG />}
      </motion.div>
    ))}
  </>
);

export default Decorations;
