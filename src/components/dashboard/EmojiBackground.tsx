import { motion } from 'framer-motion'

export const EmojiBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl blur-[1px]"
          initial={{
            top: "-20%",
            left: `${Math.random() * 100}%`,
            rotate: Math.random() * 360,
            opacity: 0.3,
          }}
          animate={{
            top: "120%",
            rotate: Math.random() * 360 + 360,
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
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