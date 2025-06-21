"use client";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { arEG } from "react-day-picker/locale";
import moment from "moment-hijri";

import "react-day-picker/style.css";

export function MyDatePicker() {
  const [selected, setSelected] = useState<Date>();

  // تحويل التاريخ الميلادي إلى هجري

  const formatHijriDate = (date: Date) => {
    return moment(date).format("iD/iM/iYYYY");
  };
  return (
    <DayPicker
      animate
      dir="rtl"
      locale={arEG}
      numerals="latn"
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={
        selected
          ? `Selected (Hijri): ${formatHijriDate(selected)}`
          : "Pick a day."
      }
    />
  );
}