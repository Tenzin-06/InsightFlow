import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { ReportChartData } from "../types";

type ChartType = "bar" | "line" | "pie";

type ReportChartBlockProps = {
  title?: string;
  description?: string;
  data: ReportChartData[];
  chartType?: ChartType;
  height?: number;
  dataKey?: string;
  nameKey?: string;
};

const COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#14B8A6", "#8B5CF6"];
const PIE_COLORS = ["#3B82F6", "#6EA4FF", "#BFDBFE", "#E0EDFF"];

export function ReportChartBlock({
  title, description, data, chartType = "bar", height = 220,
  dataKey = "value", nameKey = "name",
}: ReportChartBlockProps) {
  return (
    <div className="space-y-3">
      {(title || description) && (
        <div>
          {title && <h3 className="text-sm font-semibold text-text-primary">{title}</h3>}
          {description && <p className="text-xs text-text-muted">{description}</p>}
        </div>
      )}
      <div className="rounded-xl border border-border-default bg-white p-4 shadow-sm dark:bg-card">
        <ResponsiveContainer width="100%" height={height}>
          {chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey={nameKey} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey={nameKey} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Line type="monotone" dataKey={dataKey} stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          ) : (
            <PieChart>
              <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
