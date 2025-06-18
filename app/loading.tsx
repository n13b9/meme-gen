import React from 'react'

function Loading() {
  return (
<div className="fixed inset-0 flex items-center justify-center bg-black z-50">
  <div className="flex flex-col items-center">
    <div className="text-6xl mb-4 animate-spin">🤣</div>

    <p className="text-lg font-semibold text-white">
      Just a moment, memes loading...
    </p>
    <p className="text-md text-gray-300">
      Get ready for meme madness! 😆
    </p>
  </div>
</div>

  )
}

export default Loading
