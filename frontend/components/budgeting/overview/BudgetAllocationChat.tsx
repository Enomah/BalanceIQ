import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import CustomTooltip from "./CustomTooltip";

interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface Props {
  data: ChartData[];
}

export default function BudgetAllocationChart({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[var(--bg-secondary)]  p-[10px] sm:p-6 rounded-lg sm:rounded-xl border border-[var(--border-light)]"
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Budget Allocation
      </h3>
      <div className="h-80 md:h-[400px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                // label={({ name, percentage }) => `${name} (${percentage}%)`}
                labelLine={false}
              >
                {data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              
              <Legend
                formatter={(value) => (
                  <span style={{ color: 'var(--text-primary)', fontSize: '12px' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
            No budget allocations to display
          </div>
        )}
      </div>
    </motion.div>
  );
}