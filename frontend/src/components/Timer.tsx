import { useState, useEffect } from "react";

function Timer({ t }: { t: number }) {
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    if (!t) return;
    setTime(t);
    console.log("Tempo mudou");
  }, [t]);

  return <h1>{time} ms</h1>;
}

export default Timer;
