// ============================================================
// App.tsx
// 應用程式根元件
// 責任：載入 mock 資料、提供切換按鈕、渲染 Dashboard
// 不在此撰寫任何金融評分邏輯
// ============================================================

import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import {
  stableValueEtfMock,
  lethalGrowthEtfMock,
  incompleteEtfMock,
  allMockEtfs,
} from "./data/mockEtfData";

// 切換按鈕的顯示設定
const ETF_SWITCHER_CONFIG = [
  {
    label: "穩健價值",
    tag: "VALUE-01",
    description: "正常穩健，無死穴警告",
    color: "emerald",
  },
  {
    label: "高風險成長",
    tag: "RISK-99",
    description: "觸發死穴警告",
    color: "rose",
  },
  {
    label: "資料缺失",
    tag: "MISS-00",
    description: "含 null / undefined",
    color: "amber",
  },
] as const;

// 確保初始資料與設定對應
const _typeCheck = allMockEtfs; // 型別對齊驗證用，不實際渲染

function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  const currentEtf = [
    stableValueEtfMock,
    lethalGrowthEtfMock,
    incompleteEtfMock,
  ][activeIndex];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      {/* ── 頂部導覽列 ─────────────────────────────────── */}
      <nav className="sticky top-0 z-10 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          {/* 品牌標題 */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">
              ETF 因子評測
            </span>
            <span className="text-xs text-gray-500 font-mono bg-white/10 px-1.5 py-0.5 rounded">
              Fama-French 5F
            </span>
          </div>

          {/* ETF 切換按鈕組 */}
          <div
            className="flex items-center gap-2 flex-wrap"
            role="group"
            aria-label="切換 ETF 測試資料"
          >
            {ETF_SWITCHER_CONFIG.map((config, index) => {
              const isActive = activeIndex === index;
              const colorMap = {
                emerald: isActive
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "text-emerald-400 border-emerald-800 hover:bg-emerald-950",
                rose: isActive
                  ? "bg-rose-600 text-white border-rose-500"
                  : "text-rose-400 border-rose-800 hover:bg-rose-950",
                amber: isActive
                  ? "bg-amber-600 text-white border-amber-500"
                  : "text-amber-400 border-amber-800 hover:bg-amber-950",
              };

              return (
                <button
                  key={config.tag}
                  id={`etf-switch-${config.tag}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  title={config.description}
                  className={`
                    flex flex-col items-start gap-0 px-3 py-1.5 rounded-lg border text-left
                    text-xs font-medium transition-all duration-150 cursor-pointer
                    ${colorMap[config.color]}
                  `}
                  aria-pressed={isActive}
                >
                  <span>{config.label}</span>
                  <span className="font-mono opacity-70">{config.tag}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── 主內容區 ────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Dashboard etf={currentEtf} />
      </main>

    </div>
  );
}

export default App;
