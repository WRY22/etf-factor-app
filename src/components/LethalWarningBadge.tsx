// ============================================================
// LethalWarningBadge.tsx
// 高風險死穴警告卡片
// 責任：判斷是否觸發三條件死穴，觸發時顯示醒目紅色警告
// ============================================================

import type { ETFDataInput } from "../types/etf";
import { isLethalPortfolioRisk } from "../utils/factorLabelUtils";

interface LethalWarningBadgeProps {
  /** ETF UI 安全輸入資料，用於判斷是否觸發高風險死穴 */
  etf: ETFDataInput;
}

/**
 * 高風險死穴警告卡片元件。
 *
 * 當 ETF 同時滿足以下三個條件時顯示紅色警告：
 * - smb  >  0.2（大量小型股暴露）
 * - rmw  < -0.3（嚴重低獲利能力）
 * - cma  < -0.3（高度積極投資）
 *
 * 未觸發條件時回傳 null，不佔任何版面空間。
 */
export function LethalWarningBadge({ etf }: LethalWarningBadgeProps) {
  if (!isLethalPortfolioRisk(etf)) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="
        relative overflow-hidden
        rounded-xl border border-red-500/60
        bg-gradient-to-r from-red-950 via-red-900 to-red-950
        px-5 py-4
        shadow-[0_0_24px_rgba(239,68,68,0.25)]
      "
    >
      {/* 背景光暈裝飾 */}
      <div className="pointer-events-none absolute inset-0 bg-red-500/5 rounded-xl" />

      {/* 內容列 */}
      <div className="relative flex items-start gap-3">
        {/* 骷髏頭圖示 */}
        <SkullIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

        {/* 文字區塊 */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold tracking-wide text-red-300 uppercase">
            高風險死穴警告
          </span>
          <p className="text-sm leading-relaxed text-red-100">
            警告：此 ETF 持有大量低獲利卻過度投資的小型股，屬於模型無法解釋的高風險死穴，可能嚴重拖累績效！
          </p>
          {/* 觸發條件說明 */}
          <div className="mt-1 flex flex-wrap gap-2">
            <ConditionBadge label="SMB > 0.2" hint="大量小型股暴露" />
            <ConditionBadge label="RMW < -0.3" hint="嚴重低獲利" />
            <ConditionBadge label="CMA < -0.3" hint="高度積極投資" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 內部子元件
// ─────────────────────────────────────────────────────────────

interface ConditionBadgeProps {
  label: string;
  hint: string;
}

function ConditionBadge({ label, hint }: ConditionBadgeProps) {
  return (
    <span
      title={hint}
      className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-mono text-red-300 border border-red-500/30"
    >
      {label}
    </span>
  );
}

interface IconProps {
  className?: string;
}

function SkullIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* 頭蓋骨 */}
      <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7Z" />
      {/* 眼睛 */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 10.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm3.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
        className="fill-red-950"
      />
      {/* 下顎牙齒 */}
      <rect x="9" y="18" width="2" height="2" rx="0.5" />
      <rect x="13" y="18" width="2" height="2" rx="0.5" />
    </svg>
  );
}
