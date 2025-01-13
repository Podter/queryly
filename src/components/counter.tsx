import { useState } from "react";

import { Button } from "./ui/button";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Button onClick={() => setCount((prev) => prev + 1)}>Count: {count}</Button>
  );
}
