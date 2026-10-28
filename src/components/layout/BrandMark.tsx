/** MediSetu logo mark (a plus sign on a rounded square). */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="#0f766e" />
      <path d="M26 14h12v12h12v12H38v12H26V38H14V26h12z" fill="#fff" />
    </svg>
  );
}
