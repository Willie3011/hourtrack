/**
 * Converts a time string HH:MM to toal minutes since midnight
 */

export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

/**
 * Converts total minutes to a time string HH:MM
 */

export const minutesToTimeString = (minutes: number): string => {
    const hours = Math.floor(minutes/60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2,'0')}`;
};

/**
 * Formats minutes into a readable duration string
 * e.g 480 -> "8 hrs", 500 -> "8 hrs 20 mins"
 */

export const  formatDuration = (totalMinutes: number): string => {
    if (totalMinutes <= 0) return '0 hrs';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (minutes === 0) return `${hours} hrs`;
    return `${hours} hours ${minutes} mins`
};

/**
 * Calculates net shift hours after lunch deduction
 * 
 * Rules:
 * - Standard 1 hour (60 mins) lunch is always deducted.
 * - If actual lunch duration exceeds 60 mins the extra is also deducted.
 * - If no lunch times are provided only the standard 60 mins is deducted
 * 
 * Returns net minutes worked
 */

export const calculateNetShiftMinutes = (
    shiftStart: string,
    shiftEnd: string,
    lunchOut?: string | null,
    lunchIn?: string | null,
): number => {
    const startMinutes = timeToMinutes(shiftStart);
    const endMinutes = timeToMinutes(shiftEnd);
    const rawMinutes = endMinutes - startMinutes;

    // Standard 1 hour lunch deduction
    const standardLunchMinutes = 60;

    //Calculate actual lunch duration if logged
    let actualLunchMinutes = 0;
    if (lunchOut && lunchIn) {
        const lunchOutMinutes = timeToMinutes(lunchOut);
        const lunchInMinutes = timeToMinutes(lunchIn);
        actualLunchMinutes = lunchInMinutes - lunchOutMinutes;
    }

    //Extra deduction if lunch exceeded 1 hour
    const extraLunchDeduction = Math.max(actualLunchMinutes - standardLunchMinutes, 0);
    
    //Net minutes = raw - standard lunch - any extra lunch
    const netMinutes = rawMinutes - standardLunchMinutes - extraLunchDeduction;

    return Math.max(netMinutes, 0)
}

/**
 *  Calculate lost time in minutes within a shift
 * Loast time = late arrival + extra lunch time beyond standard
 */

export const calculateLostTimeMinutes = (
    shiftStart: string,
    arrivalTime?: string | null,
    lunchOut?: string | null,
    lunchIn?: string | null
): number => {
    let lostMinutes = 0;

    // late arrival
    if(arrivalTime) {
        const scheduledStart = timeToMinutes(shiftStart);
        const actualArrival = timeToMinutes(arrivalTime);
        const lateMinutes = Math.max(actualArrival - scheduledStart, 0);
        lostMinutes += lateMinutes;
    }

    // Extended lunch beyond 1 hour
    if (lunchOut && lunchIn) {
        const lunchOutMinutes = timeToMinutes(lunchOut);
        const lunchInMinutes = timeToMinutes(lunchIn);
        const lunchDuration =lunchInMinutes - lunchOutMinutes;
        const extraLunch = Math.max(lunchDuration - 60, 0);
        lostMinutes += extraLunch;
    }
        
    return lostMinutes;
}

/**
 * Calculates expected earnings for a regular or holiday shift
 */

export const calculateRegularEarnings = (
    netMinutes: number,
    hourlyRate: number,
    multiplier: number = 1
): number => {
    const netHours = netMinutes / 60;
    return netHours * hourlyRate * multiplier;
};

/**
 * Calculates overtime earnings
 * Overtime before and after are both at the overtime rate
 */

export const calculateOvertimeEarnings = (
    overtimeBeforeStart?: string | null,
    overtimeBeforeEnd?: string | null,
    overtimeAfterStart?: string | null,
    overtimeAfterEnd?: string | null,
    hourlyRate: number = 0,
    overtimeMultiplier: number = 1.5, 
): {overtimeMinutes: number; overtimeEarnings: number} => {
    let overtimeMinutes = 0;

    if (overtimeBeforeStart && overtimeBeforeEnd) {
        overtimeMinutes += timeToMinutes(overtimeBeforeEnd) - timeToMinutes(overtimeBeforeStart)
    }

    if (overtimeAfterStart && overtimeAfterEnd) {
        overtimeMinutes += timeToMinutes(overtimeAfterEnd) - timeToMinutes(overtimeAfterStart);
    }

    const overtimeEarnings = (overtimeMinutes / 60) * hourlyRate * overtimeMultiplier;

    return {overtimeMinutes, overtimeEarnings}
};

/**
 * Calculate nightshift earnings
 * 1 hour per shift is converted to overtime
 * remaining hours at regular rate plus 10% nightshift allowance
 */

export const calculateNightshiftEarnings = (
    netMinutes: number,
    hourlyRate: number,
    overtimeMultiplier: number
): {
    overtimeMinutes: number;
    regularMinutes: number;
    overtimeEarnings: number;
    regularEarnings: number;
    nightshiftAllowance: number;
    totalEarnings: number
} => {
    const overtimeMinutes = 60;
    const regularMinutes = Math.max(netMinutes - overtimeMinutes, 0);

    const overtimeEarnings = (overtimeMinutes / 60) * hourlyRate * overtimeMultiplier;
    const regularEarnings = (regularMinutes / 60) * hourlyRate;
    const nightshiftAllowance = (regularMinutes / 60) * (hourlyRate * 0.1);
    const totalEarnings = overtimeEarnings + regularEarnings + nightshiftAllowance;

    return {
        overtimeMinutes,
        regularMinutes,
        overtimeEarnings,
        regularEarnings,
        nightshiftAllowance,
        totalEarnings
    }
};

/**
 * Master calculation function that handles all shift types
 * Returns a complete earnings breakdown for a shift
 */

export const calculateShiftEarnings = (params: {
  shiftStart: string;
  shiftEnd: string;
  shiftType: 'Regular' | 'Holiday' | 'Nightshift';
  hourlyRate: number;
  overtimeMultiplier: number;
  holidayMultiplier: number;
  overtimeBeforeStart?: string | null;
  overtimeBeforeEnd?: string | null;
  overtimeAfterStart?: string | null;
  overtimeAfterEnd?: string | null;
  lunchOut?: string | null;
  lunchIn?: string | null;
  arrivalTime?: string | null;
}): {
    netMinutes: number;
    regularHours: number;
    overtimeHours: number;
    nightshiftAllowance: number;
    lostTimeMinutes: number;
    expectedEarnings: number;
} => {
    const {
    shiftStart,
    shiftEnd,
    shiftType,
    hourlyRate,
    overtimeMultiplier,
    holidayMultiplier,
    overtimeBeforeStart,
    overtimeBeforeEnd,
    overtimeAfterStart,
    overtimeAfterEnd,
    lunchOut,
    lunchIn,
    arrivalTime,
  } = params;

  //Net shift minutes after lunch deduction
  const netMinutes = calculateNetShiftMinutes(
    shiftStart,
    shiftEnd,
    lunchOut,
    lunchIn
  );

  //lost time
  const lostTimeMinutes = calculateLostTimeMinutes(
    shiftStart,
    arrivalTime,
    lunchOut,
    lunchIn
    );

    //overtime earnings
    const {overtimeMinutes, overtimeEarnings} = calculateOvertimeEarnings(
        overtimeBeforeStart,
        overtimeBeforeEnd,
        overtimeAfterStart,
        overtimeAfterEnd,
        hourlyRate,
        overtimeMultiplier
    );

    let regularHours = 0;
    let nightshiftAllowance = 0;
    let shiftEarnings = 0;

    if(shiftType === 'Regular') {
        regularHours = netMinutes / 60;
        shiftEarnings = calculateRegularEarnings(netMinutes, hourlyRate);
    } else if (shiftType === 'Holiday') {
        regularHours = netMinutes / 60;
        shiftEarnings = calculateRegularEarnings(netMinutes, hourlyRate, holidayMultiplier);
    } else if (shiftType === 'Nightshift') {
        const nightshift = calculateNightshiftEarnings(netMinutes, hourlyRate,overtimeMultiplier);
        regularHours = nightshift.regularMinutes / 60;
        nightshiftAllowance = nightshift.nightshiftAllowance;
        shiftEarnings = nightshift.totalEarnings;
    }

    const expectedEarnings = shiftEarnings + overtimeEarnings;
    const overtimeHours = overtimeMinutes / 60;

    return {
        netMinutes,
        regularHours,
        overtimeHours,
        nightshiftAllowance,
        lostTimeMinutes,
        expectedEarnings
    }
}