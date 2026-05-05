// ============================================================
// StarRating.tsx
// 星等顯示元件
// 責任：純粹顯示 1–5 顆星，不做任何金融邏輯計算
// ============================================================

import type { StarRatingValue } from "../types/etf";
import { EmptyValue } from "./EmptyValue";

interface StarRatingProps {
  /** 星等值 1–5，null 代表資料無效，顯示「暫無數據」 */
  rating: StarRatingValue;
  /** 選填標籤，顯示在星星右側（例如因子名稱） */
  label?: string;
}

const TOTAL_STARS = 5;

/**
 * 星等顯示元件。
 * 依照傳入的 rating 顯示實心星（已獲得）與空心星（未獲得）。
 * rating 為 null 時交由 EmptyValue 元件處理，不在此計算任何金融分數。
 */
export function StarRating({ rating, label }: StarRatingProps) {
  if (rating === null) {
    return (
      <div className="flex items-center gap-2">
        {label && (
          <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
        )}
        <EmptyValue />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
      )}
      <div className="flex items-center gap-0.5" aria-label={`評分 ${rating} 顆星（共 ${TOTAL_STARS} 顆）`}>
        {Array.from({ length: TOTAL_STARS }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= rating;

          return (
            <Star
              key={starNumber}
              filled={isFilled}
            />
          );
        })}
      </div>
      <span className="text-xs text-gray-500 tabular-nums">
        {rating}/{TOTAL_STARS}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 內部子元件：單顆星
// ─────────────────────────────────────────────────────────────

interface StarProps {
  filled: boolean;
}

function Star({ filled }: StarProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-5 h-5 transition-colors duration-150 ${
        filled
          ? "fill-amber-400 text-amber-400"
          : "fill-transparent text-gray-600 stroke-gray-600"
      }`}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}
