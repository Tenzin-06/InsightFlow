import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/features/analytics/constants";
import type { TimeSeriesPoint } from "@/features/analytics/types";

type Props = {
  data: TimeSeriesPoint[];
  label?: string;
  yFormatter?: (value: number) => string;
  height?: number;
};

export function AnalyticsTrendChart({
  data,
  label = "Responses",
  yFormatter,
  height = 200,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="date"
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
        <Area
          type="monotone"
          dataKey="value"
          name={label}
          stroke={CHART_COLORS.primary}
          strokeWidth={2.5}
          fill="url(#trendGradient)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
