import React from 'react'

const BUBBLES = [
  { left: '4%', size: 14, duration: 22, delay: -2, drift: 14, alpha: 0.26 },
  { left: '11%', size: 22, duration: 28, delay: -8, drift: -12, alpha: 0.2 },
  { left: '18%', size: 10, duration: 20, delay: -5, drift: 10, alpha: 0.3 },
  { left: '28%', size: 18, duration: 26, delay: -11, drift: 16, alpha: 0.24 },
  { left: '36%', size: 12, duration: 24, delay: -3, drift: -10, alpha: 0.25 },
  { left: '47%', size: 26, duration: 30, delay: -15, drift: 18, alpha: 0.18 },
  { left: '56%', size: 9, duration: 19, delay: -9, drift: -8, alpha: 0.32 },
  { left: '64%', size: 16, duration: 27, delay: -13, drift: 12, alpha: 0.22 },
  { left: '73%', size: 13, duration: 23, delay: -4, drift: -14, alpha: 0.27 },
  { left: '81%', size: 20, duration: 31, delay: -18, drift: 15, alpha: 0.21 },
  { left: '89%', size: 11, duration: 21, delay: -7, drift: -11, alpha: 0.29 },
  { left: '95%', size: 15, duration: 25, delay: -12, drift: 9, alpha: 0.24 },
]

export default function BubbleBackdrop() {
  return (
    <div className="marketing-bubbles" aria-hidden="true">
      <div className="marketing-bubbles__mist" />
      {BUBBLES.map((bubble, i) => (
        <span
          // Fixed seed values keep animation deterministic.
          key={`bubble-${i}`}
          className="ink-bubble"
          style={{
            left: bubble.left,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
            opacity: bubble.alpha,
            '--bubble-drift': `${bubble.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
