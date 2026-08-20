export function PawLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Michi"
      role="img"
    >
      <ellipse cx="24" cy="30" rx="11" ry="9.5" fill="currentColor" />
      <ellipse cx="10" cy="16" rx="5" ry="6" fill="currentColor" />
      <ellipse cx="21" cy="9" rx="5" ry="6.5" fill="currentColor" />
      <ellipse cx="34" cy="9" rx="5" ry="6.5" fill="currentColor" />
      <ellipse cx="42" cy="18" rx="4.5" ry="5.5" fill="currentColor" />
    </svg>
  )
}
