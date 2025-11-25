'use client';
import { useState } from 'react';

export default function Component() {
  // Regular variable - gets reset on every render
  let count = 0;

  // State - React remembers this between renders
  const [stateCount, setStateCount] = useState(0);

  return (
    <div>
      <p>Regular: {count}</p> {/* Always 0 */}
      <p>State: {stateCount}</p> {/* Actually increases */}
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          count++; // Lost on next render!
          setStateCount(stateCount + 1); // Remembered!
        }}
      >
        Increment
      </button>
    </div>
  );
}
