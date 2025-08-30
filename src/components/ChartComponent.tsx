import { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartComponentProps {
  chartData: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
}

const ChartComponent = memo(function ChartComponent({ chartData }: ChartComponentProps) {
  return (
    <>
      <div className="mb-8">
        <div 
          className="h-80"
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={3}
                dataKey="value"
                stroke="rgba(15, 23, 42, 0.8)"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [`$ ${value.toLocaleString()}`, name]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid rgba(139, 92, 246, 0.8)',
                  borderRadius: '12px',
                  color: '#1e293b',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '12px 16px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  outline: 'none'
                }}
                labelStyle={{
                  color: '#7c3aed',
                  fontWeight: '700',
                  fontSize: '16px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="space-y-2 max-w-xl mx-auto">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-white font-medium text-sm select-none">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-red-400 font-semibold text-sm select-none">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

export default ChartComponent;
