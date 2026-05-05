// ============================================================
// mockEtfData.ts
// 測試用 Mock ETF 資料
// 涵蓋三種情境：正常穩健、高風險死穴、資料缺失
// ============================================================

import type { ETFDataInput } from "../types/etf";

// ─────────────────────────────────────────────────────────────
// 情境一：正常穩健 ETF
// 預期結果：
//   - 無 LethalWarning
//   - RMW ★★★★☆（0.28 → 4星）
//   - CMA ★★★★★（0.36 → 4星）
//   - HML_O ★★★★☆（0.32 → 4星）
//   - Momentum ★★★★☆（72 → 4星）
//   - Defensive ★★★★☆（13.5 → 4星）
//   - Beta 接近市場（0.92）
//   - SMB 偏向大型權值股（-0.08）
// ─────────────────────────────────────────────────────────────

export const stableValueEtfMock: ETFDataInput = {
  etfId: "VALUE-01",
  etfName: "穩健價值 ETF",
  slopes: {
    mkt: 0.92,
    smb: -0.08,
    hml_o: 0.32,
    rmw: 0.28,
    cma: 0.36,
  },
  momentum_score: 72,
  volatility: 13.5,
};

// ─────────────────────────────────────────────────────────────
// 情境二：高風險死穴 ETF
// 預期結果：
//   - ✅ 觸發 LethalWarning（smb=0.42 > 0.2、rmw=-0.45 < -0.3、cma=-0.52 < -0.3）
//   - RMW ★☆☆☆☆（-0.45 → 1星）
//   - CMA ★☆☆☆☆（-0.52 → 1星）
//   - HML_O ★★☆☆☆（-0.22 → 2星）
//   - Momentum ★★★★★（81 → 5星）
//   - Defensive ★☆☆☆☆（31.8 → 1星）
//   - Beta 高市場敏感度（1.35）
//   - SMB 偏向中小型股（0.42）
// ─────────────────────────────────────────────────────────────

export const lethalGrowthEtfMock: ETFDataInput = {
  etfId: "RISK-99",
  etfName: "高風險小型成長 ETF",
  slopes: {
    mkt: 1.35,
    smb: 0.42,
    hml_o: -0.22,
    rmw: -0.45,
    cma: -0.52,
  },
  momentum_score: 81,
  volatility: 31.8,
};

// ─────────────────────────────────────────────────────────────
// 情境三：資料缺失測試 ETF
// 預期結果：
//   - 無 LethalWarning（缺值時 isLethalPortfolioRisk 回傳 false）
//   - mkt、smb、rmw、cma、momentum_score、volatility 顯示「暫無數據」
//   - hml_o 有值，顯示 HML_O 星等
//   - UI 不崩潰
// ─────────────────────────────────────────────────────────────

export const incompleteEtfMock: ETFDataInput = {
  etfId: "MISS-00",
  etfName: "資料缺失測試 ETF",
  slopes: {
    mkt: null,
    smb: undefined,
    hml_o: 0.1,
    rmw: null,
    cma: undefined,
  },
  momentum_score: null,
  volatility: undefined,
};

// ─────────────────────────────────────────────────────────────
// 所有 Mock 資料彙整（供 App.tsx 切換用）
// ─────────────────────────────────────────────────────────────

export const allMockEtfs: ETFDataInput[] = [
  stableValueEtfMock,
  lethalGrowthEtfMock,
  incompleteEtfMock,
];
