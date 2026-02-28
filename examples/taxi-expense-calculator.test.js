#!/usr/bin/env node
/**
 * 택시비 경비 계산기 테스트
 * Usage: node taxi-expense-calculator.test.js
 */

'use strict';

const { calculateTaxiFare, separateVat, calculateExpenseSummary } = require('./taxi-expense-calculator');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

function assertClose(actual, expected, tolerance, message) {
  assert(Math.abs(actual - expected) <= tolerance, `${message} (actual: ${actual}, expected: ${expected})`);
}

// ── 택시 요금 계산 테스트 ──

console.log('\n── calculateTaxiFare ──');

// 기본요금만 (기본거리 이내)
{
  const result = calculateTaxiFare({ distanceKm: 1, type: 'medium' });
  assert(result.totalFare === 4800, '중형 1km: 기본요금 4,800원');
  assert(result.distanceCharge === 0, '기본거리 이내 거리요금 0');
  assert(result.timeCharge === 0, '대기 없으면 시간요금 0');
}

// 거리요금 포함
{
  const result = calculateTaxiFare({ distanceKm: 5, type: 'medium' });
  // 5000m - 1600m = 3400m 초과, 3400/131 = 25.95 → 25단위 × 100원 = 2500원
  assert(result.distanceCharge === 2500, '중형 5km: 거리요금 2,500원');
  assert(result.totalFare === 4800 + 2500, '중형 5km: 총 7,300원');
}

// 시간요금 포함
{
  const result = calculateTaxiFare({ distanceKm: 1, waitMinutes: 5, type: 'medium' });
  // 5분 = 300초, 300/30 = 10단위 × 100원 = 1000원
  assert(result.timeCharge === 1000, '대기 5분: 시간요금 1,000원');
  assert(result.totalFare === 4800 + 1000, '기본 + 시간요금 = 5,800원');
}

// 심야할증
{
  const result = calculateTaxiFare({ distanceKm: 1, type: 'medium', night: true });
  assert(result.totalFare === Math.round(4800 * 1.2), '심야할증 적용: 5,760원');
  assert(result.surchargeMultiplier === 1.2, '심야할증 배율 1.2');
}

// 대형 택시
{
  const result = calculateTaxiFare({ distanceKm: 1, type: 'large' });
  assert(result.totalFare === 7000, '대형 1km: 기본요금 7,000원');
  assert(result.type === '대형/모범', '대형 택시 라벨');
}

// 심야 + 시외 이중 할증
{
  const result = calculateTaxiFare({ distanceKm: 1, type: 'medium', night: true, outside: true });
  assert(result.surchargeMultiplier === 1.44, '심야+시외 할증 배율 1.44');
  assert(result.totalFare === Math.round(4800 * 1.44), '이중 할증 적용');
}

// ── VAT 분리 테스트 ──

console.log('\n── separateVat ──');

{
  const result = separateVat(11000);
  assert(result.supplyPrice === 10000, '11,000원 → 공급가액 10,000원');
  assert(result.vat === 1000, '11,000원 → VAT 1,000원');
}

{
  const result = separateVat(4800);
  // 4800 / 1.1 = 4363.6... → 4364 (반올림)
  assert(result.supplyPrice === 4364, '4,800원 → 공급가액 4,364원');
  assert(result.vat === 436, '4,800원 → VAT 436원');
}

// ── 경비 처리 요약 테스트 ──

console.log('\n── calculateExpenseSummary ──');

{
  const summary = calculateExpenseSummary({
    farePerTrip: 10000,
    tripsPerMonth: 20,
    annualIncome: 50_000_000,
  });

  assert(summary.monthly.total === 200000, '월 택시비 200,000원');
  assert(summary.annual.total === 2400000, '연간 택시비 2,400,000원');
  assert(summary.taxEffect.marginalRate === 0.15, '5천만원 한계세율 15%');

  // 연간 공급가액 = 2400000 / 1.1 ≈ 2181818
  const expectedSupply = Math.round(2400000 / 1.1);
  assertClose(summary.annual.supply, expectedSupply, 1, '연간 공급가액');

  // 소득세 절감 = 공급가액 × 15%
  const expectedTaxSaving = Math.round(expectedSupply * 0.15);
  assertClose(summary.taxEffect.incomeTaxSaving, expectedTaxSaving, 1, '소득세 절감 효과');
}

// 높은 소득 구간 테스트
{
  const summary = calculateExpenseSummary({
    farePerTrip: 15000,
    tripsPerMonth: 30,
    annualIncome: 100_000_000,
  });

  assert(summary.taxEffect.marginalRate === 0.35, '1억원 한계세율 35%');
  assert(summary.annual.total === 15000 * 30 * 12, '연간 총액 정확');
}

// 낮은 소득 구간 테스트
{
  const summary = calculateExpenseSummary({
    farePerTrip: 5000,
    tripsPerMonth: 10,
    annualIncome: 10_000_000,
  });

  assert(summary.taxEffect.marginalRate === 0.06, '1천만원 한계세율 6%');
}

// ── 결과 ──

console.log(`\n결과: ${passed}개 통과, ${failed}개 실패`);
process.exit(failed > 0 ? 1 : 0);
