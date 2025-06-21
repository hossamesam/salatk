declare module 'hijri-date' {
    export default class HijriDate {
        constructor(date?: Date | number);
        getDate(): number;
        getMonth(): number;
        getFullYear(): number;
    }
}