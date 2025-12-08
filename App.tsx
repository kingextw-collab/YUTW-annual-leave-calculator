import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { CalculationInputs, CalculationResult } from './types';
import { calculateSubsidy } from './services/calculationService';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    hireDate: '',
    calcDate: new Date().toISOString().split('T')[0], // Default to today
    suspendStart: '',
    suspendEnd: '',
    projectUsageDate: ''
  });

  const [result, setResult] = useState<CalculationResult>({
    totalAmount: 0,
    currentYearCount: 0,
    breakdown: []
  });

  // Automatically recalculate when inputs change
  useEffect(() => {
    const res = calculateSubsidy(
      inputs.hireDate,
      inputs.calcDate,
      inputs.suspendStart,
      inputs.suspendEnd,
      inputs.projectUsageDate
    );
    setResult(res);
  }, [inputs]);

  const runTestCase = () => {
    setInputs({
        hireDate: '2020-03-10',
        calcDate: '2027-10-15',
        suspendStart: '2025-05-01',
        suspendEnd: '2025-12-31',
        projectUsageDate: '2025-07-03'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
                <Plane className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              旅遊補助<span className="text-blue-600">計算機</span>
            </h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            國外旅遊補助系統 v2.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
             <InputSection 
                inputs={inputs} 
                setInputs={setInputs} 
                onRunTest={runTestCase}
             />
             
             {/* Info Box */}
             <div className="bg-blue-50 rounded-xl p-6 text-sm text-blue-800 border border-blue-100">
                <h4 className="font-semibold mb-2">補助規範與邏輯</h4>
                <ul className="list-disc list-inside space-y-1 opacity-80 mb-4">
                    <li>滿 1~2 年：$10,000</li>
                    <li>滿 2~3 年：$14,000</li>
                    <li>滿 3 年以上：$18,000</li>
                </ul>
                <h4 className="font-semibold mb-2 text-amber-800">特殊規則</h4>
                <ul className="list-disc list-inside space-y-1 opacity-80 text-amber-900">
                    <li>暫停期間：若週年日落在此期間，金額歸零。</li>
                    <li>專案扣抵：若於暫停期間申請使用，將「扣抵」下一次恢復後的額度。</li>
                </ul>
             </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            <ResultsSection result={result} />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default App;
