import React from 'react';
import { Calendar, AlertCircle, Briefcase } from 'lucide-react';
import { CalculationInputs } from '../types';

interface InputSectionProps {
  inputs: CalculationInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculationInputs>>;
  onRunTest: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({ inputs, setInputs, onRunTest }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Calendar size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">參數設定</h2>
      </div>

      <div className="space-y-6">
        {/* Core Dates */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              員工到職日
            </label>
            <input
              type="date"
              name="hireDate"
              value={inputs.hireDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              試算截止日
            </label>
            <input
              type="date"
              name="calcDate"
              value={inputs.calcDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Suspension */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center mb-4">
            <AlertCircle size={16} className="text-amber-500 mr-2" />
            <h3 className="text-sm font-semibold text-gray-700">暫停補助期間 (選填)</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                起始日
              </label>
              <input
                type="date"
                name="suspendStart"
                value={inputs.suspendStart}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                結束日
              </label>
              <input
                type="date"
                name="suspendEnd"
                value={inputs.suspendEnd}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Project Usage */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center mb-2">
            <Briefcase size={16} className="text-purple-500 mr-2" />
            <h3 className="text-sm font-semibold text-gray-700">專案申請使用日 (選填)</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">
             若曾在暫停期間以專案名義申請，將扣抵恢復後的第一次補助。
          </p>
          <div>
            <input
              type="date"
              name="projectUsageDate"
              value={inputs.projectUsageDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
            />
          </div>
        </div>

        <div className="pt-4">
            <button
                onClick={onRunTest}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
                載入測試案例
            </button>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
