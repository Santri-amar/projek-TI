export function Logo({ className = "" }) {
  return (
    <div className={`auth-brand ${className}`}>
      <div className="auth-brand__icon">
        <img src="/auth-logo.png" alt="Schools Logo" />
      </div>
      <img className="auth-brand__title" src="/auth-schools.png" alt="SCHOOLS" />
      <img className="auth-brand__subtitle" src="/auth-mis.png" alt="MANAGEMENT INFORMATION SYSTEM" />
    </div>
  );
}