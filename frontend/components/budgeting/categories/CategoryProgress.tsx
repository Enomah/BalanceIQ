import { Progress } from "../Progress";

interface Props {
  progress: number;
  isOverspent: boolean;
  color: string;
}

export default function CategoryProgress({ progress, isOverspent, color }: Props) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-[var(--text-primary)]">Progress</span>
        <span className={`text-xs font-medium ${isOverspent ? 'text-[var(--error-600)]' : 'text-[var(--text-primary)]'}`}>
          {progress.toFixed(1)}%
        </span>
      </div>
      <Progress value={progress} color={isOverspent ? "var(--error-500)" : color} showLabel={false} />
    </div>
  );
}