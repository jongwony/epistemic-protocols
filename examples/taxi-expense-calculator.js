#!/usr/bin/env node
/**
 * 개인 사업자 택시비 경비 계산기
 * - 택시 요금 계산 (기본요금 + 거리요금 + 시간요금)
 * - 부가가치세(VAT) 분리
 * - 경비 처리 가능 금액 산출
 * - 소득세 절감 효과 추정
 *
 * Usage: node taxi-expense-calculator.js
 */

'use strict';

const readline = require('readline');

// ── 상수 ──

/** 2024년 기준 서울 택시 요금 체계 */
const TAXI_FARE = {
  medium: {
    label: '중형',
    baseFare: 4800,          // 기본요금 (원)
    baseDistance: 1600,       // 기본거리 (m)
    distanceUnit: 131,       // 거리요금 단위 (m)
    distanceUnitFare: 100,   // 거리요금 단위당 요금 (원)
    timeUnit: 30,            // 시간요금 단위 (초)
    timeUnitFare: 100,       // 시간요금 단위당 요금 (원)
    nightSurcharge: 1.2,     // 심야할증 (23시~04시)
    outsideSurcharge: 1.2,   // 시외할증
  },
  large: {
    label: '대형/모범',
    baseFare: 7000,
    baseDistance: 1600,
    distanceUnit: 151,
    distanceUnitFare: 200,
    timeUnit: 30,
    timeUnitFare: 200,
    nightSurcharge: 1.2,
    outsideSurcharge: 1.2,
  },
};

/** 세율 */
const TAX_RATES = {
  vat: 0.1,                   // 부가가치세 10%
  /** 개인 사업자 종합소득세 과세표준 구간 (2024) */
  incomeTaxBrackets: [
    { limit: 14_000_000, rate: 0.06 },
    { limit: 50_000_000, rate: 0.15 },
    { limit: 88_000_000, rate: 0.24 },
    { limit: 150_000_000, rate: 0.35 },
    { limit: 300_000_000, rate: 0.38 },
    { limit: 500_000_000, rate: 0.40 },
    { limit: 1_000_000_000, rate: 0.42 },
    { limit: Infinity, rate: 0.45 },
  ],
};

// ── 계산 함수 ──

/**
 * 택시 요금 계산
 * @param {object} params
 * @param {number} params.distanceKm - 이동 거리 (km)
 * @param {number} params.waitMinutes - 대기/저속 시간 (분)
 * @param {'medium'|'large'} params.type - 택시 유형
 * @param {boolean} params.night - 심야 여부
 * @param {boolean} params.outside - 시외 여부
 * @returns {object} 요금 상세
 */
function calculateTaxiFare({ distanceKm, waitMinutes = 0, type = 'medium', night = false, outside = false }) {
  const fare = TAXI_FARE[type];
  const distanceM = distanceKm * 1000;

  // 기본요금
  let total = fare.baseFare;

  // 거리요금 (기본거리 초과분)
  const extraDistance = Math.max(0, distanceM - fare.baseDistance);
  const distanceCharge = Math.floor(extraDistance / fare.distanceUnit) * fare.distanceUnitFare;
  total += distanceCharge;

  // 시간요금 (대기/저속 시간)
  const waitSeconds = waitMinutes * 60;
  const timeCharge = Math.floor(waitSeconds / fare.timeUnit) * fare.timeUnitFare;
  total += timeCharge;

  // 할증
  let surchargeMultiplier = 1;
  if (night) surchargeMultiplier *= fare.nightSurcharge;
  if (outside) surchargeMultiplier *= fare.outsideSurcharge;
  total = Math.round(total * surchargeMultiplier);

  return {
    type: fare.label,
    baseFare: fare.baseFare,
    distanceCharge,
    timeCharge,
    surchargeMultiplier,
    totalFare: total,
  };
}

/**
 * VAT 분리 계산
 * 택시 요금은 VAT 포함 금액
 * @param {number} totalFare - 총 요금 (VAT 포함)
 * @returns {object} 공급가액, VAT
 */
function separateVat(totalFare) {
  const supplyPrice = Math.round(totalFare / (1 + TAX_RATES.vat));
  const vat = totalFare - supplyPrice;
  return { supplyPrice, vat };
}

/**
 * 월간/연간 택시비 경비 처리 요약
 * @param {object} params
 * @param {number} params.farePerTrip - 1회 요금
 * @param {number} params.tripsPerMonth - 월간 이용 횟수
 * @param {number} params.annualIncome - 연간 소득 (과세표준 추정용)
 * @returns {object} 경비 처리 요약
 */
function calculateExpenseSummary({ farePerTrip, tripsPerMonth, annualIncome = 50_000_000 }) {
  const monthlyTotal = farePerTrip * tripsPerMonth;
  const annualTotal = monthlyTotal * 12;

  const { supplyPrice: monthlySupply, vat: monthlyVat } = separateVat(monthlyTotal);
  const { supplyPrice: annualSupply, vat: annualVat } = separateVat(annualTotal);

  // 적용 세율 구간 결정
  const bracket = TAX_RATES.incomeTaxBrackets.find(b => annualIncome <= b.limit);
  const marginalRate = bracket ? bracket.rate : 0.45;

  // 경비 처리 시 절감 효과
  // 공급가액은 경비(필요경비)로 인정, VAT는 매입세액공제 (일반과세자 기준)
  const incomeTaxSaving = Math.round(annualSupply * marginalRate);
  const vatDeduction = annualVat; // 일반과세자 매입세액공제
  const totalSaving = incomeTaxSaving + vatDeduction;

  return {
    monthly: { total: monthlyTotal, supply: monthlySupply, vat: monthlyVat, trips: tripsPerMonth },
    annual: { total: annualTotal, supply: annualSupply, vat: annualVat },
    taxEffect: {
      marginalRate,
      incomeTaxSaving,
      vatDeduction,
      totalSaving,
    },
  };
}

// ── 출력 ──

function formatKRW(amount) {
  return amount.toLocaleString('ko-KR') + '원';
}

function printFareResult(fareResult) {
  console.log('\n── 택시 요금 계산 결과 ──');
  console.log(`택시 유형      : ${fareResult.type}`);
  console.log(`기본요금       : ${formatKRW(fareResult.baseFare)}`);
  console.log(`거리요금       : ${formatKRW(fareResult.distanceCharge)}`);
  console.log(`시간요금       : ${formatKRW(fareResult.timeCharge)}`);
  if (fareResult.surchargeMultiplier > 1) {
    console.log(`할증 배율      : x${fareResult.surchargeMultiplier}`);
  }
  console.log(`총 요금        : ${formatKRW(fareResult.totalFare)}`);

  const { supplyPrice, vat } = separateVat(fareResult.totalFare);
  console.log(`  공급가액     : ${formatKRW(supplyPrice)}`);
  console.log(`  부가가치세   : ${formatKRW(vat)}`);
}

function printExpenseSummary(summary) {
  console.log('\n── 경비 처리 요약 ──');
  console.log(`월 이용 횟수   : ${summary.monthly.trips}회`);
  console.log(`월 택시비      : ${formatKRW(summary.monthly.total)}`);
  console.log(`  공급가액     : ${formatKRW(summary.monthly.supply)}`);
  console.log(`  부가가치세   : ${formatKRW(summary.monthly.vat)}`);
  console.log(`연간 택시비    : ${formatKRW(summary.annual.total)}`);
  console.log(`  공급가액     : ${formatKRW(summary.annual.supply)}`);
  console.log(`  부가가치세   : ${formatKRW(summary.annual.vat)}`);

  console.log('\n── 세금 절감 효과 (추정) ──');
  console.log(`적용 한계세율  : ${(summary.taxEffect.marginalRate * 100).toFixed(0)}%`);
  console.log(`소득세 절감    : ${formatKRW(summary.taxEffect.incomeTaxSaving)}`);
  console.log(`매입세액공제   : ${formatKRW(summary.taxEffect.vatDeduction)} (일반과세자)`);
  console.log(`총 절감 효과   : ${formatKRW(summary.taxEffect.totalSaving)}`);

  console.log('\n※ 간이과세자는 매입세액공제가 제한됩니다.');
  console.log('※ 실제 세금은 다른 경비 및 공제에 따라 달라질 수 있습니다.');
  console.log('※ 업무 관련성이 입증되어야 경비 인정됩니다 (거래처 방문, 업무 미팅 등).');
  console.log('※ 법인카드/사업용 카드 결제 또는 현금영수증(지출증빙) 필수.');
}

// ── 대화형 입력 ──

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  console.log('========================================');
  console.log('  개인 사업자 택시비 경비 계산기');
  console.log('========================================');

  const rl = createInterface();

  try {
    // 택시 유형
    const typeInput = await ask(rl, '\n택시 유형 (1: 중형, 2: 대형/모범) [1]: ');
    const type = typeInput.trim() === '2' ? 'large' : 'medium';

    // 이동 거리
    const distanceInput = await ask(rl, '이동 거리 (km): ');
    const distanceKm = parseFloat(distanceInput);
    if (isNaN(distanceKm) || distanceKm <= 0) {
      console.error('올바른 거리를 입력하세요.');
      rl.close();
      return;
    }

    // 대기 시간
    const waitInput = await ask(rl, '대기/저속 시간 (분) [0]: ');
    const waitMinutes = parseFloat(waitInput) || 0;

    // 심야 여부
    const nightInput = await ask(rl, '심야 운행 (23시~04시)? (y/n) [n]: ');
    const night = nightInput.trim().toLowerCase() === 'y';

    // 시외 여부
    const outsideInput = await ask(rl, '시외 운행? (y/n) [n]: ');
    const outside = outsideInput.trim().toLowerCase() === 'y';

    // 요금 계산
    const fareResult = calculateTaxiFare({ distanceKm, waitMinutes, type, night, outside });
    printFareResult(fareResult);

    // 경비 처리 계산 여부
    const expenseInput = await ask(rl, '\n경비 처리 시뮬레이션을 하시겠습니까? (y/n) [y]: ');
    if (expenseInput.trim().toLowerCase() !== 'n') {
      const tripsInput = await ask(rl, '월간 택시 이용 횟수: ');
      const tripsPerMonth = parseInt(tripsInput, 10);
      if (isNaN(tripsPerMonth) || tripsPerMonth <= 0) {
        console.error('올바른 횟수를 입력하세요.');
        rl.close();
        return;
      }

      const incomeInput = await ask(rl, '연간 과세표준 추정 (만원) [5000]: ');
      const annualIncome = (parseInt(incomeInput, 10) || 5000) * 10000;

      const summary = calculateExpenseSummary({
        farePerTrip: fareResult.totalFare,
        tripsPerMonth,
        annualIncome,
      });
      printExpenseSummary(summary);
    }
  } finally {
    rl.close();
  }
}

// ── 모듈 내보내기 (테스트용) ──

module.exports = { calculateTaxiFare, separateVat, calculateExpenseSummary, TAXI_FARE, TAX_RATES };

// 직접 실행 시
if (require.main === module) {
  main().catch(console.error);
}
