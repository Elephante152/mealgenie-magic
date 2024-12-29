import { motion } from 'framer-motion'

export const EmojiBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          initial={{
            top: "-20%",
            left: `${Math.random() * 100}%`,
            rotate: Math.random() * 360,
          }}
          animate={{
            top: "120%",
            rotate: Math.random() * 360 + 360,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {['🥗', '🍽️', '🥘', '🍳', '🥑', '🍆', '🥕'][Math.floor(Math.random() * 7)]}
        </motion.div>
      ))}
    </div>
  )
}