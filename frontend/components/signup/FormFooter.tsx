import Link from "next/link";

export default function FormFooter() {
  return (
    <>
      <div className="mt-6 text-center">
        <p className="text-white/70">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white hover:text-[var(--primary-200)] font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
      <div className="mt-6 text-center text-xs text-white/50">
        <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </>
  );
}