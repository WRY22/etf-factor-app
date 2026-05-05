// ============================================================
// factorLabelUtils.ts
// 因子文字標籤與風險判斷工具函式
// 純 TypeScript，無 React 依賴，無副作用
// ============================================================

import type { ETFDataInput } from "../types/etf";
import { isFiniteNumber } from "./numberGuards";

// ============================================================
// SMB 規模風格標籤
// ============================================================

/**
 * 將 SMB 斜率轉換為可讀的規模風格說明文字。
 *
 * SMB（Small Minus Big）正值代表偏向小型股，負值代表偏向大型權值股。
 * 接近零代表規模風格中性。
 *
 * @param smbSlope - SMB 迴歸斜率（接受 unknown，由函式內部驗證）
 * @returns 規模風格說明文字，資料無效時回傳「暫無數據」
 *
 * @example
 * getSMBExposureLabel(0.35)  // "偏向中小型股"
 * getSMBExposureLabel(0.1)   // "略偏中小型股"
 * getSMBExposureLabel(0.0)   // "規模風格中性"
 * getSMBExposureLabel(-0.2)  // "偏向大型權值股"
 * getSMBExposureLabel(null)  // "暫無數據"
 */
export function getSMBExposureLabel(smbSlope: unknown): string {
  if (!isFiniteNumber(smbSlope)) return "暫無數據";

  if (smbSlope > 0.2)                        return "偏向中小型股";
  if (smbSlope > 0.05)                       return "略偏中小型股";
  if (smbSlope >= -0.05 && smbSlope <= 0.05) return "規模風格中性";
  return "偏向大型權值股";
}

// ============================================================
// CMA 投資風格標籤
// ============================================================

/**
 * 將 CMA 斜率轉換為可讀的投資風格說明文字。
 *
 * CMA（Conservative Minus Aggressive）正值代表保守投資風格，
 * 負值代表積極投資風格。強烈負值（< -0.3）屬於高風險暴露，需明確標示。
 *
 * @param cmaSlope - CMA 迴歸斜率（接受 unknown，由函式內部驗證）
 * @returns 投資風格說明文字，資料無效時回傳「暫無數據」
 *
 * @example
 * getCMAExposureLabel(0.3)   // "保守投資／低資產成長"
 * getCMAExposureLabel(0.1)   // "投資風格中性偏保守"
 * getCMAExposureLabel(-0.1)  // "偏積極投資"
 * getCMAExposureLabel(-0.5)  // "積極投資／高資產成長風險"
 * getCMAExposureLabel(null)  // "暫無數據"
 */
export function getCMAExposureLabel(cmaSlope: unknown): string {
  if (!isFiniteNumber(cmaSlope)) return "暫無數據";

  if (cmaSlope < -0.3)  return "積極投資／高資產成長風險";
  if (cmaSlope < 0)     return "偏積極投資";
  if (cmaSlope < 0.25)  return "投資風格中性偏保守";
  return "保守投資／低資產成長";
}

// ============================================================
// Lethal Warning 高風險死穴判斷
// ============================================================

/**
 * 判斷此 ETF 是否觸發「高風險死穴」警告。
 *
 * 必須同時滿足以下三個條件才觸發：
 * 1. smb  >  0.2  →  大量暴露於小型股
 * 2. rmw  < -0.3  →  嚴重低獲利能力
 * 3. cma  < -0.3  →  高度積極投資（高資產成長風險）
 *
 * 此組合代表：持有大量低獲利卻過度投資的小型股，
 * 屬於 Fama-French 模型無法充分解釋的高風險暴露，
 * 可能嚴重拖累長期績效。
 *
 * 任何欄位缺失或為無效值時，一律回傳 false（不誤報警告）。
 *
 * @param etf - ETF UI 安全輸入型別（ETFDataInput）
 * @returns true 表示觸發高風險死穴，false 表示未觸發或資料不足
 *
 * @example
 * isLethalPortfolioRisk({
 *   slopes: { smb: 0.42, rmw: -0.45, cma: -0.52 }
 * }) // true
 *
 * isLethalPortfolioRisk({
 *   slopes: { smb: 0.42, rmw: 0.1, cma: -0.52 }
 * }) // false（rmw 未達條件）
 *
 * isLethalPortfolioRisk({
 *   slopes: { smb: null, rmw: -0.45, cma: -0.52 }
 * }) // false（smb 無效）
 */
export function isLethalPortfolioRisk(etf: ETFDataInput): boolean {
  const slopes = etf?.slopes;
  if (!slopes) return false;

  const { smb, rmw, cma } = slopes;

  // 任一值無效則不觸發（避免因資料缺失誤報高風險）
  if (!isFiniteNumber(smb)) return false;
  if (!isFiniteNumber(rmw)) return false;
  if (!isFiniteNumber(cma)) return false;

  return smb > 0.2 && rmw < -0.3 && cma < -0.3;
}
