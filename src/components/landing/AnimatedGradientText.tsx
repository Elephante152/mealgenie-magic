import { motion } from "framer-motion";

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
}

export const AnimatedGradientText = ({ text, className = "" }: AnimatedGradientTextProps) => {
  return (
    <motion.span
      className={`bg-clip-text text-transparent bg-300% animate-gradient ${className}`}
      style={{
        backgroundImage: "linear-gradient(to right, #10B981, #FBBF24, #E36414, #10B981)",
      }}
    >
      {text}
    </motion.span>
  );
};