import { useState, useEffect } from 'react';

interface InitiativeCountProps {
  cx: number;
  cy: number;
}

export default function InitiativeCount({ cx, cy }: InitiativeCountProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const randomValue = Math.floor(Math.random() * 50) + 1;
    setCount(randomValue);
  }, []);

  if (count === null) {
    return null;
  }

  return (
    <text x={cx} y={cy} fontSize="10" fill="black" textAnchor="middle">
      {count}
    </text>
  );
}
