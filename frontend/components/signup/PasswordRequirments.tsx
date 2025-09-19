import { CheckCircle, XCircle } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
}

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const passwordRequirements = [
    { id: 1, text: "At least 8 characters", met: password.length >= 8 },
    { id: 2, text: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { id: 3, text: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { id: 4, text: "Contains number", met: /\d/.test(password) },
  ];

  return (
    <div className="mt-3 space-y-2 grid hidden">
      {passwordRequirements.map((req) => (
        <div key={req.id} className="flex items-center text-sm">
          {req.met ? (
            <CheckCircle className="h-4 w-4 text-[var(--success-300)] mr-2" />
          ) : (
            <XCircle className="h-4 w-4 text-[var(--error-300)] mr-2" />
          )}
          <span className={req.met ? "text-[var(--success-300)]" : "text-white/70"}>
            {req.text}
          </span>
        </div>
      ))}
    </div>
  );
}