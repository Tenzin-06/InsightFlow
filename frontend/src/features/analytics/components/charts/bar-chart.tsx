import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CHART_COLORS } from "@/features/analytics/constants";
import type { CategoryPoint } from "@/features/analytics/types";

type Props = {
  data: CategoryPoint[];
  label?: string;
  yFormatter?: (value: number) => string;
  height?: number;
  /** Use per-item fill colours from data, otherwise uniform primary colour */
  useItemColors?: boolean;
};

export function AnalyticsBarChart({
  data,
  label = "Value",
  yFormatter,
  height = 260,
  useItemColors = false,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={yFormatter}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            fontSize: "12px",
            boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
          }}
          formatter={(value) => [
            typeof value === "number"
              ? (yFormatter ? yFormatter(value) : value)
              : value,
            label,
          ]}
        />
        <Bar dataKey="value" name={label} radius={[4, 4, 0, 0]} maxBarSize={52}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={useItemColors && entry.fill ? entry.fill : CHART_COLORS.primary}
              opacity={0.9}
            />
          ))}
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  );
}
