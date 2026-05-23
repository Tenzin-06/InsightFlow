import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PIE_COLORS } from "@/features/analytics/constants";
import type { CategoryPoint } from "@/features/analytics/types";

type Props = {
  data: CategoryPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
};

export function AnalyticsPieChart({
  data,
  height = 260,
  innerRadius = 55,
  outerRadius = 90,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.fill ?? PIE_COLORS[index % PIE_COLORS.length]}
              stroke="none"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            fontSize: "12px",
            boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
          }}
          formatter={(value, name) => [value, name]}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px" }}
          iconType="circle"
          iconSize={8}
        />
      </RePieChart>
    </ResponsiveContainer>
  );
}
