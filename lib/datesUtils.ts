import { ChronoUnit, LocalDate, ZoneId, convert } from "@js-joda/core";

export const getNumWeeksAfterStartDate = (startDate: LocalDate, date: LocalDate): number => {
    const daysDiff = date.until(startDate, ChronoUnit.DAYS);
    let weeksDiff = Math.round(daysDiff / 7);
    // Return a negative number if the date is before the start date
    return startDate.isAfter(date) ? -weeksDiff : weeksDiff;
}

export function localDateToJsDate(localDate: LocalDate): Date {
    return convert(localDate.atStartOfDay().atZone(ZoneId.UTC)).toDate();
}