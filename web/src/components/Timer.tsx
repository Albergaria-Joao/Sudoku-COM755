import { useState, useEffect } from "react";

function Timer({ t }: { t: number[] }) {
  const [time, setTime] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    if (!t) return;
    setTime(t);
    console.log("Tempo mudou");
  }, [t]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Tempo de execução</h2>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="text-left p-2 text-lg">Técnica</th>
            <th className="text-right p-2 text-lg">Tempo</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b border-gray-700">
            <td className="p-2 text-lg">Preenchendo aleatoriamente</td>
            <td className="p-2 text-lg text-right">{t[0]} ms</td>
          </tr>

          <tr className="border-b border-gray-700">
            <td className="p-2 text-lg">Eliminando possibilidades</td>
            <td className="p-2 text-lg text-right">{t[1]} ms</td>
          </tr>

          <tr>
            <td className="p-2 text-lg">Eliminando com X-Wing</td>
            <td className="p-2 text-lg text-right">{t[2]} ms</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

}

export default Timer;
