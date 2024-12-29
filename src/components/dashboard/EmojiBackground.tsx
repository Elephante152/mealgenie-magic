import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const emojis = ['🥗', '🥘', '🍲', '🥪', '🥙', '🌮', '🍱', '🍛', '🥑', '🥕', '🍅', '🥦'];

export const EmojiBackground = () => {
  const [emojiElements, setEmojiElements] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  useEffect(() => {
    const generatePosition = () => {
      // Create a grid-like distribution with more columns and rows for better spread
      const columns = 8;
      const rows = 6;
      const elements = [];
      
      for (let i = 0; i < columns * rows; i++) {
        const column = i % columns;
        const row = Math.floor(i / columns);
        
        // Calculate base position with better distribution
        const baseX = (window.innerWidth / columns) * column;
        const baseY = (window.innerHeight / rows) * row;
        
        // Add random offset for natural look but maintain better spread
        const randomOffsetX = (Math.random() - 0.5) * (window.innerWidth / columns * 0.3);
        const randomOffsetY = (Math.random() - 0.5) * (window.innerHeight / rows * 0.3);
        
        elements.push({
          id: i,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          x: baseX + randomOffsetX,
          y: baseY + randomOffsetY,
        });
      }
      
      setEmojiElements(elements);
    };

    generatePosition();
    
    // Regenerate positions on window resize
    window.addEventListener('resize', generatePosition);
    return () => window.removeEventListener('resize', generatePosition);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {emojiElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-3xl text-gray-200/20"
          initial={{ x: element.x, y: element.y, opacity: 0 }}
          animate={{
            y: [element.y, element.y - 20, element.y],
            x: [element.x, element.x + (Math.random() * 20 - 10), element.x],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  );
};