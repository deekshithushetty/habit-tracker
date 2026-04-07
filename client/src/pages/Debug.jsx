export const Debug = () => {
  const testEmojis = ['🔥', '🏃', '📖', '💧', '🎸', '✍️', '💊', '📵', '🧘', '✅'];
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Emoji Debug Test
      </h1>
      
      {/* Test 1: Plain text emojis */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Test 1: Plain Text</h2>
        <p className="text-2xl">🔥 🏃 📖 💧 🎸 ✍️ 💊 📵 🧘 ✅</p>
      </div>
      
      {/* Test 2: Span with emoji class */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Test 2: Span Elements</h2>
        <div className="flex gap-2 text-2xl">
          {testEmojis.map((emoji, i) => (
            <span key={i}>{emoji}</span>
          ))}
        </div>
      </div>
      
      {/* Test 3: With explicit font-family */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Test 3: Explicit Font</h2>
        <div className="flex gap-2 text-2xl">
          {testEmojis.map((emoji, i) => (
            <span 
              key={i}
              style={{
                fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
      
      {/* Test 4: Native emoji input */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Test 4: Input Field</h2>
        <input 
          type="text" 
          defaultValue="🔥🏃📖💧" 
          className="w-full p-3 border rounded-lg text-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          readOnly
        />
      </div>

      {/* Test 5: Unicode escape */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Test 5: Unicode Escape</h2>
        <p className="text-2xl">{'\u{1F525}'} {'\u{1F3C3}'} {'\u{1F4D6}'} {'\u{1F4A7}'}</p>
      </div>
      
      {/* Test 6: Image fallback */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Test 6: Twemoji Images</h2>
        <div className="flex gap-2">
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f525.png" alt="fire" className="w-8 h-8" />
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3c3.png" alt="runner" className="w-8 h-8" />
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4d6.png" alt="book" className="w-8 h-8" />
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4a7.png" alt="water" className="w-8 h-8" />
        </div>
      </div>

      {/* Device info */}
      <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-xl text-sm">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Device Info</h2>
        <p className="text-gray-600 dark:text-gray-400 break-all">
          User Agent: {navigator.userAgent}
        </p>
      </div>
    </div>
  );
};