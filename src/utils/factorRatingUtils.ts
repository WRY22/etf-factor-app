// ============================================================
// factorRatingUtils.ts
// Fama-French 五因子星等轉換函式
// 所有函式皆為 pure function，無副作用，無 React 依賴
// ============================================================

import type { StarRatingValue } from "../types/etf";
import { isFiniteNumber, clamp } from "./numberGuards";

// ============================================================
// RMW 獲利能力星等
// ============================================================

/**
 * 將 Fama-French RMW 斜率轉換為 1–5 顆星的獲利能力評分。
 *
 * RMW（Robust Minus Weak）正值代表 ETF 更多暴露於獲利能力強的公司。
 * 數值越大，獲利能力評分越高；負值代表暴露於弱獲利公司，僅給 1 顆星。
 *
 * @param rmwSlope - RMW 迴歸斜率（接受 unknown，由函式內部驗證）
 * @returns 1–5 的星等，或 null（資料無效時）
 *
 * @example
 * calculateRMWStarRating(0.5)   // 5
 * calculateRMWStarRating(0.2)   // 3
 * calculateRMWStarRating(-0.1)  // 1
 * calculateRMWStarRating(null)  // null
 */
export function calculateRMWStarRating(rmwSlope: unknown): StarRatingValue {
  if (!isFiniteNumber(rmwSlope)) return null;

  if (rmwSlope < 0)    return 1;
  if (rmwSlope < 0.1)  return 2;
  if (rmwSlope < 0.25) return 3;
  if (rmwSlope < 0.4)  return 4;
  return 5;
}

// ============================================================
// CMA 保守投資星等
// ⚠️ 重要：正值越大星等越高，負值代表積極投資不得給高星
// ============================================================

/**
 * 將 Fama-French CMA 斜率轉換為 1–5 顆星的保守投資評分。
 *
 * CMA（Conservative Minus Aggressive）正值代表 ETF 暴露於保守投資、
 * 低資產成長的公司，視為資本配置紀律較佳的風格。
 *
 * ⚠️ 警告：CMA 強烈負值（< -0.3）代表高度積極投資或大量資產擴張，
 * 屬於高風險暴露，必須只給 1 顆星，**絕對不可因「積極成長」給高星**。
 *
 * @param cmaSlope - CMA 迴歸斜率（接受 unknown，由函式內部驗證）
 * @returns 1–5 的星等，或 null（資料無效時）
 *
 * @example
 * calculateCMAStarRating(0.5)   // 5
 * calculateCMAStarRating(0.2)   // 3
 * calculateCMAStarRating(-0.1)  // 1  ← 負值一律 1 星
 * calculateCMAStarRating(-0.5)  // 1  ← 強烈負值同樣 1 星
 * calculateCMAStarRating(null)  // null
 */
export function calculateCMAStarRating(cmaSlope: unknown): StarRatingValue {
  if (!isFiniteNumber(cmaSlope)) return null;

  // 所有負值（包含強烈負值）一律 1 顆星
  // 原因：cma < 0 代表偏積極投資，本評分衡量的是「保守資本配置」能力
  if (cmaSlope < 0)    return 1;
  if (cmaSlope < 0.1)  return 2;
  if (cmaSlope < 0.25) return 3;
  if (cmaSlope < 0.4)  return 4;
  return 5;
}

// ============================================================
// HML_O 價值暴露星等
// ============================================================

/**
 * 將正交化 HML 斜率轉換為 1–5 顆星的價值風格評分。
 *
 * HML_O（Orthogonalized High Minus Low）正值代表 ETF 更多暴露於
 * 價值股（低本益比、低股價淨值比），正值越大代表越偏價值風格。
 * 負值代表暴露於成長股（高估值），評分較低。
 *
 * @param hmlOSlope - HML_O 迴歸斜率（接受 unknown，由函式內部驗證）
 * @returns 1–5 的星等，或 null（資料無效時）
 *
 * @example
 * calculateHMLOStarRating(0.4)   // 5
 * calculateHMLOStarRating(0.2)   // 4
 * calculateHMLOStarRating(0.05)  // 3
 * calculateHMLOStarRating(-0.1)  // 2
 * calculateHMLOStarRating(-0.5)  // 1
 * calculateHMLOStarRating(null)  // null
 */
export function calculateHMLOStarRating(hmlOSlope: unknown): StarRatingValue {
  if (!isFiniteNumber(hmlOSlope)) return null;

  if (hmlOSlope < -0.3)  return 1;
  if (hmlOSlope < 0)     return 2;
  if (hmlOSlope < 0.15)  return 3;
  if (hmlOSlope < 0.35)  return 4;
  return 5;
}

// ============================================================
// Momentum 動能星等
// ============================================================

/**
 * 將 0–100 的動能分數轉換為 1–5 顆星的動能評分。
 *
 * 動能分數越高，代表近期報酬持續性越強或趨勢越明顯。
 * 超出 0–100 範圍的值會先 clamp 後再轉換，不會直接視為無效。
 *
 * @param momentumScore - 動能分數（0–100，接受 unknown，由函式內部驗證）
 * @returns 1–5 的星等，或 null（資料無效時）
 *
 * @example
 * calculateMomentumStarRating(85)   // 5
 * calculateMomentumStarRating(65)   // 4
 * calculateMomentumStarRating(50)   // 3
 * calculateMomentumStarRating(25)   // 2
 * calculateMomentumStarRating(10)   // 1
 * calculateMomentumStarRating(110)  // 5（clamp 至 100）
 * calculateMomentumStarRating(null) // null
 */
export function calculateMomentumStarRating(
  momentumScore: unknown
): StarRatingValue {
  if (!isFiniteNumber(momentumScore)) return null;

  // 先將超出 0–100 的值限制在合法範圍
  const clamped = clamp(momentumScore, 0, 100);

  if (clamped < 20) return 1;
  if (clamped < 40) return 2;
  if (clamped < 60) return 3;
  if (clamped < 80) return 4;
  return 5;
}

// ============================================================
// Volatility 防禦星等（反向：波動度越低，星等越高）
// ============================================================

/**
 * 將歷史波動度轉換為 1–5 顆星的防禦評分。
 *
 * 此評分為**反向評分**：波動度越低代表防禦特性越強，因此星等越高。
 * 高波動度（>= 30%）代表防禦能力極弱，只能給 1 顆星。
 *
 * @param volatility - 歷史波動度百分比（例如 15.3 代表 15.3%，接受 unknown）
 * @returns 1–5 的星等，或 null（資料無效時）
 *
 * @example
 * calculateDefensiveStarRating(8)    // 5（低波動，強防禦）
 * calculateDefensiveStarRating(12)   // 4
 * calculateDefensiveStarRating(17)   // 3
 * calculateDefensiveStarRating(25)   // 2
 * calculateDefensiveStarRating(35)   // 1（高波動，弱防禦）
 * calculateDefensiveStarRating(null) // null
 */
export function calculateDefensiveStarRating(
  volatility: unknown
): StarRatingValue {
  if (!isFiniteNumber(volatility)) return null;

  if (volatility < 10)  return 5;
  if (volatility < 15)  return 4;
  if (volatility < 20)  return 3;
  if (volatility < 30)  return 2;
  return 1;
}
