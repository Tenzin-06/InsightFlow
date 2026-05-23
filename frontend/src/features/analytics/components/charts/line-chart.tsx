import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CHART_COLORS } from "@/features/analytics/constants";
import type { TimeSeriesPoint } from "@/features/analytics/types";

type Props = {
  data: TimeSeriesPoint[];
  primaryLabel?: string;
  secondaryLabel?: string;
  /** y-axis formatter, e.g. (v) => `${v}%` */
  yFormatter?: (value: number) => string;
  height?: number;
};

export function AnalyticsLineChart({
  data,
  primaryLabel = "Responses",
  secondaryLabel = "Clicks",
  yFormatter,
  height = 260,
}: Props) {
  const hasSecondary = data.some((d) => d.secondary !== undefined);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
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
          formatter={(value, name) => [
            typeof value === "number"
              ? (yFormatter ? yFormatter(value) : value)
              : value,
            name,
          ]}
        />
        {hasSecondary && (
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            iconType="circle"
            iconSize={8}
          />
        )}
        <Line
          type="monotone"
          dataKey="value"
          name={primaryLabel}
          stroke={CHART_COLORS.primary}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        {hasSecondary && (
          <Line
            type="monotone"
            dataKey="secondary"
            name={secondaryLabel}
            stroke={CHART_COLORS.secondary}
            strokeWidth={2}
            strokeDasharray="4 2"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        )}
      </ReLineChart>
    </ResponsiveContainer>
  );
}
