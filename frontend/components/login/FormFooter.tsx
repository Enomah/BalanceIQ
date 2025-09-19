import Link from "next/link";

interface FormFooterProps {
  onToggleForm?: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({ onToggleForm }) => {
  return (
    <>
      <div className="mt-6 text-center">
        <p className="text-white/70">
          Don't have an account?{" "}
          <Link
            href="/signup"
            onClick={onToggleForm}
            className="text-white hover:text-[var(--primary-200)] font-medium transition-colors"
          >
            Sign up now
          </Link>
        </p>
      </div>
      <div className="mt-6 pt-6 border-t border-white/20 text-center">
        <p className="text-xs text-white/50">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </>
  );
};

export default FormFooter;