/**
 * Emoji component using Twemoji CDN images
 * Works on all devices without any dependencies
 */

// Map common emojis to their Unicode code points
const emojiCodePoints = {
  '🔥': '1f525',
  '🏃': '1f3c3',
  '📖': '1f4d6',
  '💧': '1f4a7',
  '🎸': '1f3b8',
  '✍️': '270d',
  '💊': '1f48a',
  '📵': '1f4f5',
  '🧘': '1f9d8',
  '✅': '2705',
  '🧠': '1f9e0',
  '💪': '1f4aa',
  '🚶': '1f6b6',
  '🎯': '1f3af',
  '📝': '1f4dd',
  '🌅': '1f305',
  '🧹': '1f9f9',
  '💰': '1f4b0',
  '📞': '1f4de',
  '🎨': '1f3a8',
  '🌿': '1f33f',
  '☕': '2615',
  '🍎': '1f34e',
  '🚿': '1f6bf',
  '🥗': '1f957',
  '😴': '1f634',
  '⚡': '26a1',
  '👥': '1f465',
  '✨': '2728',
  '🎉': '1f389',
  '💬': '1f4ac',
  '⭐': '2b50',
  '❤️': '2764',
  '🙏': '1f64f',
  '👋': '1f44b',
  '🚀': '1f680'
};

// Get code point for an emoji
const getCodePoint = (emoji) => {
  if (emojiCodePoints[emoji]) {
    return emojiCodePoints[emoji];
  }
  
  // Fallback: calculate code point from emoji
  const codePoint = emoji.codePointAt(0);
  if (codePoint) {
    return codePoint.toString(16);
  }
  
  return null;
};

export const Emoji = ({ 
  children, 
  size = 'md',
  className = '',
  fallback = true
}) => {
  const sizeMap = {
    xs: 14,
    sm: 18,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48
  };

  const pixelSize = sizeMap[size] || sizeMap.md;
  const emoji = typeof children === 'string' ? children.trim() : '';
  const codePoint = getCodePoint(emoji);

  // If we can't get a code point, render the emoji as text (fallback)
  if (!codePoint) {
    return (
      <span 
        className={`inline-flex items-center justify-center ${className}`}
        style={{
          width: pixelSize,
          height: pixelSize,
          fontSize: pixelSize * 0.8,
          lineHeight: 1,
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codePoint}.svg`}
      alt={emoji}
      className={`inline-block ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        verticalAlign: 'middle'
      }}
      loading="lazy"
      onError={(e) => {
        // If image fails to load, replace with text emoji
        if (fallback) {
          const span = document.createElement('span');
          span.textContent = emoji;
          span.style.fontSize = `${pixelSize}px`;
          span.style.lineHeight = '1';
          e.target.parentNode.replaceChild(span, e.target);
        }
      }}
    />
  );
};