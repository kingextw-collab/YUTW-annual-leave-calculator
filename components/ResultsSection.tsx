import React from 'react';
import { CalculationResult, SubsidyStatus } from '../types';
import { DollarSign, CheckCircle2, Ban, TrendingUp, CalendarCheck, AlertTriangle } from 'lucide-react';

interface ResultsSectionProps {
  result: CalculationResult;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const getStatusBadge = (status: SubsidyStatus) => {
    switch (status) {
        case 'ELIGIBLE':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle2 size={12} className="mr-1" />
                    符合資格
                </span>
            );
        case 'SUSPENDED':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Ban size={12} className="mr-1" />
                    暫停補助
                </span>
            );
        case 'DEDUCTED':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    <AlertTriangle size={12} className="mr-1" />
                    專案扣抵
                </span>
            );
        case 'NOT_ELIGIBLE':
        default:
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    未符資格
                </span>
            );
    }
};

const ResultsSection: React.FC<ResultsSectionProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center space-x-3 text-gray-500 mb-2">
            <div className="p-2 bg-green-100 rounded-full text-green-600">
              <DollarSign size={20} />
            </div>
            <span className="text-sm font-medium uppercase tracking-wide">累計補助金額</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(result.totalAmount)}</div>
            <div className="text-sm text-gray-500 mt-1">累積總額 (Total Subsidy Amount)</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center space-x-3 text-gray-500 mb-2">
            <div className="p-2 bg-purple-100 rounded-full text-purple-600">
              <CalendarCheck size={20} />
            </div>
            <span className="text-sm font-medium uppercase tracking-wide">試算當年度狀態</span>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold text-gray-900">{result.currentYearCount}</div>
                <span className="text-gray-500">次 (可申請)</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
                {result.currentYearCount === 1 
                    ? "本年度已取得資格" 
                    : "未取得資格、已暫停或被扣抵"}
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-gray-500" />
                <h3 className="font-semibold text-gray-800">歷年詳細試算</h3>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">週年制</span>
        </div>
        
        <div className="overflow-x-auto">
          {result.breakdown.length === 0 ? (
             <div className="p-8 text-center text-gray-500">
                請輸入有效的到職日與試算截止日以檢視詳細資料。
             </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">週年紀念日</th>
                  <th className="px-6 py-4">年資</th>
                  <th className="px-6 py-4">理論金額</th>
                  <th className="px-6 py-4">狀態</th>
                  <th className="px-6 py-4 text-right">實際發放</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.breakdown.map((row) => (
                  <tr key={row.year} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {row.anniversaryDate}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {row.seniority} 年
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatCurrency(row.theoreticalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${row.actualAmount === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
                        {row.actualAmount === 0 && row.theoreticalAmount > 0 ? (
                            <span className="line-through mr-2 opacity-50">{formatCurrency(row.theoreticalAmount)}</span>
                        ) : null}
                        {formatCurrency(row.actualAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-semibold text-gray-900">
                  <tr>
                      <td colSpan={4} className="px-6 py-4 text-right">總計累積金額</td>
                      <td className="px-6 py-4 text-right text-blue-600 text-lg">
                          {formatCurrency(result.totalAmount)}
                      </td>
                  </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
