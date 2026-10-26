/**
 * CPU Performance Calculator - Logic & Interactions
 * Computer Organization and Architecture (COA) Mini Project
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Inputs
  const form = document.getElementById('calculator-form');
  const instructionInput = document.getElementById('instruction-count');
  const cpiInput = document.getElementById('cpi');
  const clockRateInput = document.getElementById('clock-rate');
  const clockUnitSelect = document.getElementById('clock-unit');

  // Form Groups & Error Containers
  const groupInstruction = document.getElementById('group-instruction-count');
  const groupCpi = document.getElementById('group-cpi');
  const groupClockRate = document.getElementById('group-clock-rate');

  const errorInstruction = document.getElementById('error-instruction-count');
  const errorCpi = document.getElementById('error-cpi');
  const errorClockRate = document.getElementById('error-clock-rate');

  // Action Buttons
  const calculateBtn = document.getElementById('calculate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const exampleBtn = document.getElementById('example-btn');

  // Results Section & Metric Displays
  const resultsSection = document.getElementById('results-section');
  const unitBadge = document.getElementById('unit-badge');
  const resExecTimeFormatted = document.getElementById('res-exec-time-formatted');
  const resExecTimeSeconds = document.getElementById('res-exec-time-seconds');
  const resExecTimeEquivalent = document.getElementById('res-exec-time-equivalent');
  const resTotalCycles = document.getElementById('res-total-cycles');
  const resPerfRate = document.getElementById('res-perf-rate');

  // Step-by-Step Breakdown Displays
  const stepCyclesCalc = document.getElementById('step-cycles-calc');
  const stepClockCalc = document.getElementById('step-clock-calc');
  const stepTimeCalc = document.getElementById('step-time-calc');
  const stepRateCalc = document.getElementById('step-rate-calc');

  // Multiplier mapping for clock rate units in Hertz (Hz)
  const CLOCK_MULTIPLIERS = {
    'GHz': 1_000_000_000,
    'MHz': 1_000_000,
    'kHz': 1_000,
    'Hz': 1
  };

  /**
   * Helper to format a number with thousands separators and clean decimal display
   */
  function formatNumber(num, maxDecimals = 4) {
    if (isNaN(num)) return '0';
    if (num === 0) return '0';
    
    // For integers or large numbers
    if (Number.isInteger(num)) {
      return num.toLocaleString('en-US');
    }

    // For floating point numbers
    const fixed = num.toFixed(maxDecimals);
    const trimmed = parseFloat(fixed).toString();
    
    // Add commas to the integer part
    const parts = trimmed.split('.');
    parts[0] = Number(parts[0]).toLocaleString('en-US');
    return parts.join('.');
  }

  /**
   * Helper to format seconds with appropriate precision
   */
  function formatSeconds(sec) {
    if (sec >= 1) {
      return `${sec.toFixed(4).replace(/\.?0+$/, '')} seconds`;
    } else if (sec >= 0.0001) {
      return `${sec.toFixed(6).replace(/\.?0+$/, '')} seconds`;
    } else {
      return `${sec.toExponential(4)} seconds`;
    }
  }

  /**
   * Display human-friendly execution time and identify the best unit
   */
  function formatExecutionTime(seconds) {
    if (seconds >= 1) {
      const valStr = formatNumber(seconds, 4);
      return {
        formatted: `${valStr} s`,
        unitLabel: 'Seconds (s)',
        rawSeconds: formatSeconds(seconds),
        equivalent: `${valStr} ${seconds === 1 ? 'second' : 'seconds'}`
      };
    } else if (seconds >= 0.001) {
      // Milliseconds (10^-3)
      const ms = seconds * 1000;
      const valStr = formatNumber(ms, 4);
      return {
        formatted: `${valStr} ms`,
        unitLabel: 'Milliseconds (ms)',
        rawSeconds: formatSeconds(seconds),
        equivalent: `${valStr} ${ms === 1 ? 'millisecond' : 'milliseconds'}`
      };
    } else if (seconds >= 0.000001) {
      // Microseconds (10^-6)
      const us = seconds * 1_000_000;
      const valStr = formatNumber(us, 4);
      return {
        formatted: `${valStr} µs`,
        unitLabel: 'Microseconds (µs)',
        rawSeconds: formatSeconds(seconds),
        equivalent: `${valStr} ${us === 1 ? 'microsecond' : 'microseconds'}`
      };
    } else {
      // Nanoseconds (10^-9)
      const ns = seconds * 1_000_000_000;
      const valStr = formatNumber(ns, 4);
      return {
        formatted: `${valStr} ns`,
        unitLabel: 'Nanoseconds (ns)',
        rawSeconds: formatSeconds(seconds),
        equivalent: `${valStr} ${ns === 1 ? 'nanosecond' : 'nanoseconds'}`
      };
    }
  }

  /**
   * Clear error state for a single field
   */
  function clearFieldError(group, errorElem, inputElem) {
    group.classList.remove('has-error');
    errorElem.textContent = '';
    inputElem.removeAttribute('aria-invalid');
  }

  /**
   * Show error state for a single field
   */
  function showFieldError(group, errorElem, inputElem, message) {
    group.classList.add('has-error');
    errorElem.textContent = message;
    inputElem.setAttribute('aria-invalid', 'true');
  }

  /**
   * Validate all form fields
   */
  function validateInputs() {
    let isValid = true;
    let firstInvalidElem = null;

    // 1. Validate Instruction Count
    const instrVal = instructionInput.value.trim();
    const instrNum = Number(instrVal);
    if (!instrVal) {
      showFieldError(groupInstruction, errorInstruction, instructionInput, 'Instruction count is required.');
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = instructionInput;
    } else if (isNaN(instrNum) || instrNum <= 0) {
      showFieldError(groupInstruction, errorInstruction, instructionInput, 'Enter a valid positive number greater than 0.');
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = instructionInput;
    } else {
      clearFieldError(groupInstruction, errorInstruction, instructionInput);
    }

    // 2. Validate CPI
    const cpiVal = cpiInput.value.trim();
    const cpiNum = Number(cpiVal);
    if (!cpiVal) {
      showFieldError(groupCpi, errorCpi, cpiInput, 'Cycles Per Instruction (CPI) is required.');
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = cpiInput;
    } else if (isNaN(cpiNum) || cpiNum <= 0) {
      showFieldError(groupCpi, errorCpi, cpiInput, 'Enter a valid positive decimal greater than 0.');
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = cpiInput;
    } else {
      clearFieldError(groupCpi, errorCpi, cpiInput);
    }

    // 3. Validate Clock Rate
    const clockVal = clockRateInput.value.trim();
    const clockNum = Number(clockVal);
    if (!clockVal) {
      showFieldError(groupClockRate, errorClockRate, clockRateInput, 'Clock rate is required.');
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = clockRateInput;
    } else if (isNaN(clockNum) || clockNum <= 0) {
      showFieldError(groupClockRate, errorClockRate, clockRateInput, 'Enter a valid positive clock rate greater than 0.');
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = clockRateInput;
    } else {
      clearFieldError(groupClockRate, errorClockRate, clockRateInput);
    }

    if (firstInvalidElem) {
      firstInvalidElem.focus();
    }

    return isValid;
  }

  /**
   * Perform CPU Performance calculations and render results
   */
  function calculatePerformance() {
    if (!validateInputs()) {
      resultsSection.classList.add('hidden');
      return;
    }

    const instructionCount = parseFloat(instructionInput.value);
    const cpi = parseFloat(cpiInput.value);
    const clockRate = parseFloat(clockRateInput.value);
    const clockUnit = clockUnitSelect.value;
    const multiplier = CLOCK_MULTIPLIERS[clockUnit] || 1_000_000_000;

    // Formulas:
    // Total Clock Cycles = Instruction Count × CPI
    const totalCycles = instructionCount * cpi;

    // Clock Rate in Hz
    const clockRateHz = clockRate * multiplier;

    // Execution Time = Total Clock Cycles / Clock Rate in Hz
    const executionTimeSeconds = totalCycles / clockRateHz;

    // Performance Rate = 1 / Execution Time
    let executionRate = 0;
    if (executionTimeSeconds > 0) {
      executionRate = 1 / executionTimeSeconds;
    }

    // Format results
    const timeFormat = formatExecutionTime(executionTimeSeconds);

    // Update Result Cards
    unitBadge.textContent = timeFormat.unitLabel;
    resExecTimeFormatted.textContent = timeFormat.formatted;
    resExecTimeSeconds.textContent = timeFormat.rawSeconds;
    if (resExecTimeEquivalent) {
      resExecTimeEquivalent.textContent = timeFormat.equivalent;
    }

    resTotalCycles.textContent = formatNumber(totalCycles);

    // Execution rate format
    if (executionRate >= 1_000_000) {
      resPerfRate.textContent = `${formatNumber(executionRate / 1_000_000, 2)}M`;
    } else {
      resPerfRate.textContent = formatNumber(executionRate, 2);
    }

    // Step-by-Step Mathematical Substitution Walkthrough
    stepCyclesCalc.textContent = `${formatNumber(instructionCount)} × ${cpi} = ${formatNumber(totalCycles)} cycles`;
    stepClockCalc.textContent = `${clockRate} ${clockUnit} = ${formatNumber(clockRateHz)} Hz`;
    stepTimeCalc.textContent = `${formatNumber(totalCycles)} / ${formatNumber(clockRateHz)} = ${timeFormat.rawSeconds} (${timeFormat.formatted})`;
    stepRateCalc.textContent = `1 / ${timeFormat.rawSeconds} = ${formatNumber(executionRate, 2)} programs/sec`;

    // Reveal Results Section
    resultsSection.classList.remove('hidden');

    // Smooth scroll to results if on mobile or small screen
    if (window.innerWidth <= 768) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Reset form and clear results
   */
  function resetCalculator() {
    form.reset();
    clockUnitSelect.value = 'GHz';

    clearFieldError(groupInstruction, errorInstruction, instructionInput);
    clearFieldError(groupCpi, errorCpi, cpiInput);
    clearFieldError(groupClockRate, errorClockRate, clockRateInput);

    resultsSection.classList.add('hidden');
    instructionInput.focus();
  }

  /**
   * Fill with pre-set example values:
   * Instruction Count: 1,000,000
   * CPI: 2
   * Clock Rate: 2 GHz
   * The user can then click Calculate Performance to see the result:
   * Total clock cycles: 2,000,000
   * Execution time: 0.001 seconds
   * Equivalent execution time: 1 millisecond
   */
  function loadExample() {
    instructionInput.value = '1000000';
    cpiInput.value = '2';
    clockRateInput.value = '2';
    clockUnitSelect.value = 'GHz';

    clearFieldError(groupInstruction, errorInstruction, instructionInput);
    clearFieldError(groupCpi, errorCpi, cpiInput);
    clearFieldError(groupClockRate, errorClockRate, clockRateInput);

    // Hide prior results so the user can click "Calculate Performance"
    resultsSection.classList.add('hidden');
    calculateBtn.focus();
  }

  // Event Listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculatePerformance();
  });

  resetBtn.addEventListener('click', resetCalculator);
  exampleBtn.addEventListener('click', loadExample);

  // Real-time error removal on user input
  instructionInput.addEventListener('input', () => {
    if (groupInstruction.classList.contains('has-error')) {
      clearFieldError(groupInstruction, errorInstruction, instructionInput);
    }
  });

  cpiInput.addEventListener('input', () => {
    if (groupCpi.classList.contains('has-error')) {
      clearFieldError(groupCpi, errorCpi, cpiInput);
    }
  });

  clockRateInput.addEventListener('input', () => {
    if (groupClockRate.classList.contains('has-error')) {
      clearFieldError(groupClockRate, errorClockRate, clockRateInput);
    }
  });

  clockUnitSelect.addEventListener('change', () => {
    if (groupClockRate.classList.contains('has-error')) {
      clearFieldError(groupClockRate, errorClockRate, clockRateInput);
    }
  });
});
