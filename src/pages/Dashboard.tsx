// ============================================================
// Dashboard.tsx
// 主頁面：ETF 因子評測 Dashboard
// 責任：整合所有 components 與 utils，顯示四個因子區塊
// ============================================================

import type { ETFDataInput } from "../types/etf";
import { formatNumberOrFallback } from "../utils/numberGuards";
import {
  calculateRMWStarRating,
  calculateCMAStarRating,
  calculateHMLOStarRating,
  calculateMomentumStarRating,
  calculateDefensiveStarRating,
} from "../utils/factorRatingUtils";
import {
  getSMBExposureLabel,
  getCMAExposureLabel,
} from "../utils/factorLabelUtils";

import { LethalWarningBadge } from "../components/LethalWarningBadge";
import { FactorPanel } from "../components/FactorPanel";
import { BetaGauge } from "../components/BetaGauge";
import { MetricRow } from "../components/MetricRow";
import { EmptyValue } from "../components/EmptyValue";

interface DashboardProps {
  /** ETF UI 安全輸入資料 */
  etf: ETFDataInput;
}

/**
 * ETF 因子評測主頁面。
 * 分為四個 FactorPanel 區塊：市場與規模、基本面、評價與動能、風險防禦。
 * 頂部放置 LethalWarningBadge，觸發條件時顯示紅色警告。
 */
export function Dashboard({ etf }: DashboardProps) {
  const slopes = etf.slopes ?? {};

  // 預先計算所有星等（由各 utils 函式處理缺值）
  const rmwRating   = calculateRMWStarRating(slopes.rmw);
  const cmaRating   = calculateCMAStarRating(slopes.cma);
  const hmlORating  = calculateHMLOStarRating(slopes.hml_o);
  const momRating   = calculateMomentumStarRating(etf.momentum_score);
  const defRating   = calculateDefensiveStarRating(etf.volatility);

  // 預先格式化所有 raw value（缺值時顯示「暫無數據」）
  const fmtMkt      = formatNumberOrFallback(slopes.mkt);
  const fmtSmb      = formatNumberOrFallback(slopes.smb);
  const fmtHmlO     = formatNumberOrFallback(slopes.hml_o);
  const fmtRmw      = formatNumberOrFallback(slopes.rmw);
  const fmtCma      = formatNumberOrFallback(slopes.cma);
  const fmtMomentum = formatNumberOrFallback(etf.momentum_score, 0);
  const fmtVol      = formatNumberOrFallback(etf.volatility);

  // 文字標籤
  const smbLabel = getSMBExposureLabel(slopes.smb);
  const cmaLabel = getCMAExposureLabel(slopes.cma);

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* ── ETF 標題列 ─────────────────────────────────── */}
      <header className="flex flex-col gap-1">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-mono text-sm text-gray-500 bg-white/10 px-2 py-0.5 rounded">
            {etf.etfId ?? "—"}
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {etf.etfName ?? <EmptyValue text="未知 ETF" />}
          </h1>
        </div>
        <p className="text-xs text-gray-500">
          本工具僅根據量化因子暴露進行風格分析，不構成任何買賣建議。
        </p>
      </header>

      {/* ── 高風險死穴警告（觸發時顯示） ──────────────── */}
      <LethalWarningBadge etf={etf} />

      {/* ── 四大區塊 Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ══ 區塊一：市場與規模 ══════════════════════════ */}
        <FactorPanel title="市場與規模" subtitle="Market & Size">
          <div className="pb-4">
            <BetaGauge beta={slopes.mkt} />
          </div>
          <MetricRow
            title="市場 Beta（原始值）"
            value={fmtMkt}
            description="衡量 ETF 對整體市場漲跌的敏感度"
          />
          <MetricRow
            title="規模因子 SMB"
            value={fmtSmb}
            description={smbLabel}
          />
        </FactorPanel>

        {/* ══ 區塊二：基本面 ══════════════════════════════ */}
        <FactorPanel title="基本面" subtitle="Profitability & Investment">
          <div className="mb-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
            <p className="text-xs text-amber-300 leading-relaxed">
              CMA 正值越高，代表越偏保守投資，星等越高。
              CMA 強烈負值代表積極投資或高資產成長風險，只能給低星等。
            </p>
          </div>
          <MetricRow
            title="獲利能力因子 RMW"
            value={fmtRmw}
            description="Robust Minus Weak，正值代表強獲利能力"
            rating={rmwRating}
          />
          <MetricRow
            title="投資因子 CMA"
            value={fmtCma}
            description={cmaLabel}
            rating={cmaRating}
          />
        </FactorPanel>

        {/* ══ 區塊三：評價與動能 ══════════════════════════ */}
        <FactorPanel title="評價與動能" subtitle="Value & Momentum">
          <MetricRow
            title="價值因子 HML_O"
            value={fmtHmlO}
            description="Orthogonal High Minus Low，正值偏向價值股"
            rating={hmlORating}
          />
          <MetricRow
            title="動能分數"
            value={`${fmtMomentum} / 100`}
            description="近期報酬持續性與趨勢強度（0–100）"
            rating={momRating}
          />
        </FactorPanel>

        {/* ══ 區塊四：風險防禦 ════════════════════════════ */}
        <FactorPanel title="風險防禦" subtitle="Defensive">
          <div className="mb-2 rounded-lg bg-sky-500/10 border border-sky-500/20 px-3 py-2">
            <p className="text-xs text-sky-300 leading-relaxed">
              波動度越低，防禦星等越高。
            </p>
          </div>
          <MetricRow
            title="歷史波動度"
            value={`${fmtVol}%`}
            description="年化歷史波動度，數值越低代表越穩健"
            rating={defRating}
          />
        </FactorPanel>

      </div>
    </div>
  );
}
