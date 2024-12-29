import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const emojis = ['🥗', '🥘', '🍲', '🥪', '🥙', '🌮', '🍱', '🍛', '🥑', '🥕', '🍅', '🥦'];

export const EmojiBackground = () => {
  const [emojiElements, setEmojiElements] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  useEffect(() => {
    // Create initial emoji positions
    const elements = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setEmojiElements(elements);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {emojiElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-4xl"
          initial={{ x: element.x, y: element.y }}
          animate={{
            y: [element.y, element.y - 100, element.y],
            x: [element.x, element.x + (Math.random() * 50 - 25), element.x],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
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