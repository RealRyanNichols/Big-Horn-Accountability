import type { LedgerRecord } from "@/lib/records";

interface StatusChartProps {
  records: LedgerRecord[];
}

export function StatusChart({ records }: StatusChartProps) {
  const counts = Array.from(
    records.reduce((map, record) => map.set(record.status, (map.get(record.status) ?? 0) + 1), new Map<string, number>()),
  ).sort((a, b) => b[1] - a[1]);
  const maximum = Math.max(...counts.map(([, count]) => count), 1);

  return (
    <div className="status-chart" aria-label="Reviewed records grouped by procedural status">
      {counts.map(([status, count]) => (
        <div className="status-row" key={status}>
          <div className="status-row-label">
            <span>{status}</span>
            <strong>{count}</strong>
          </div>
          <div className="status-track" aria-hidden="true">
            <span style={{ width: `${Math.max((count / maximum) * 100, 8)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
