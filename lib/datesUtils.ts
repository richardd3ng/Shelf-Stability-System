export const getDateAtMidnight = (date : Date) : Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}
export const getNumWeeksAfterStartDate = (startDate : Date, date : Date) : number => {
    let startDateMidnight = getDateAtMidnight(startDate);
    let dateAtMidnight = getDateAtMidnight(date);
    let msDiff = dateAtMidnight.getTime() - startDateMidnight.getTime();
    let daysDiff = msDiff / (1000 * 60 * 60 * 24);
    let weeksDiff = Math.round(daysDiff / 7);
    return weeksDiff;
}