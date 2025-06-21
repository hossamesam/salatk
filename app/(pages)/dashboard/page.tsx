// import { MyDatePicker } from "@/components/calendar/calendar"
// import { Islamic } from "@/components/calendar/islamic"
// import axios from 'axios';

import SalatkTable from "@/components/SalatkTable/SalatkTable";

export default function Page() {


  return (

        <div className="flex flex-1 flex-col gap-4 p-4 bg-gradient-to-b from-emerald-100 to-gray-100 min-h-screen">
          {/* <MyDatePicker /> */}
          <SalatkTable />
        </div>

  )
}
