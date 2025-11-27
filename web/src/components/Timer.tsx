import { useState, useEffect } from "react";

function Timer({ t }: { t: number[] }) {
  const [time, setTime] = useState<number[]>([0, 0]);

  useEffect(() => {
    if (!t) return;
    setTime(t);
    console.log("Tempo mudou");
  }, [t]);

  return (
    <div>
      <h1 className="text-3xl">Preenchendo aleatoriamente: {time[0]} ms</h1>
      <h1 className="text-3xl">Eliminando possibilidades: {time[1]} ms</h1>
    </div>
  );
}

export default Timer;
