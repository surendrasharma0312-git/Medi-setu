/** Big number with a label, used on dashboards. Values are demo numbers in this prototype. */
export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card stat">
      <p className="stat__value">{value}</p>
      <p className="stat__label">{label}</p>
    </div>
  );
}
