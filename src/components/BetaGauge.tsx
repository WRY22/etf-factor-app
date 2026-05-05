// ============================================================
// BetaGauge.tsx
// 市場 Beta 儀表顯示元件
// 責任：顯示 Beta 數值、狀態標籤與視覺儀表條，不給星等評分
// ============================================================

import { isFiniteNumber, formatNumberOrFallback } from "../utils/numberGuards";
import { EmptyValue } from "./EmptyValue";

interface BetaGaugeProps {
  /** 市場 Beta 值（接受 unknown，由元件內部驗證） */
  beta: unknown;
}

// ─────────────────────────────────────────────────────────────
// Beta 狀態定義
// ─────────────────────────────────────────────────────────────

interface BetaStatus {
  label: string;
  color: string;
  barColor: string;
}

function getBetaStatus(beta: number): BetaStatus {
  if (beta < 0.8) {
    return {
      label: "低市場敏感度",
      color: "text-sky-400",
      barColor: "bg-sky-400",
    };
  }
  if (beta <= 1.2) {
    return {
      label: "接近市場",
      color: "text-emerald-400",
      barColor: "bg-emerald-400",
    };
  }
  return {
    label: "高市場敏感度",
    color: "text-rose-400",
    barColor: "bg-rose-400",
  };
}

/**
 * 將 Beta 值映射到儀表條填充百分比（0–100%）。
 *
 * 以 beta = 1.0 為中心，顯示範圍設定為 0.0–2.0：
 * - beta = 0.0 → 0%
 * - beta = 1.0 → 50%
 * - beta = 2.0 → 100%
 * 超出範圍時 clamp 至 0–100。
 */
function betaToBarPercent(beta: number): number {
  const MIN_BETA = 0;
  const MAX_BETA = 2;
  const clamped = Math.min(Math.max(beta, MIN_BETA), MAX_BETA);
  return Math.round((clamped / MAX_BETA) * 100);
}

// ─────────────────────────────────────────────────────────────
// BetaGauge 主元件
// ─────────────────────────────────────────────────────────────

/**
 * 市場 Beta 儀表元件。
 * 顯示 Beta 數值、市場敏感度標籤與視覺儀表條。
 * beta 無效時渲染 EmptyValue，不給星等評分。
 */
export function BetaGauge({ beta }: BetaGaugeProps) {
  if (!isFiniteNumber(beta)) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-500">市場 Beta</span>
        <EmptyValue />
      </div>
    );
  }

  const status = getBetaStatus(beta);
  const barPercent = betaToBarPercent(beta);
  const formattedBeta = formatNumberOrFallback(beta, 2);

  return (
    <div className="flex flex-col gap-3">
      {/* 標題列：數值 + 狀態標籤 */}
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums text-white">
            {formattedBeta}
          </span>
          <span className="text-xs text-gray-500">β</span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* 儀表條 */}
      <div className="relative">
        {/* 背景軌道 */}
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          {/* 填充條 */}
          <div
            className={`h-full rounded-full transition-all duration-500 ${status.barColor}`}
            style={{ width: `${barPercent}%` }}
            role="progressbar"
            aria-valuenow={barPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Beta ${formattedBeta}，${status.label}`}
          />
        </div>

        {/* 基準線：beta = 1.0（中點）*/}
        <div
          className="absolute top-0 h-2 w-px bg-white/40"
          style={{ left: "50%" }}
          title="β = 1.0（市場基準）"
        />
      </div>

      {/* 刻度說明 */}
      <div className="flex justify-between text-xs text-gray-600 select-none">
        <span>0.0</span>
        <span className="text-gray-500">β = 1.0</span>
        <span>2.0</span>
      </div>
    </div>
  );
}
