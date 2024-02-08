import { LocalizationProvider } from "@mui/x-date-pickers"
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Dayjs } from "dayjs"
import dayjs from "dayjs";

interface MyDatePickerProps {
    label : string;
    setDate : (d : Date) => void;
    date : Date;
}

export const MyDatePicker : React.FC<MyDatePickerProps> = (props : MyDatePickerProps) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker timezone="UTC" value={dayjs(props.date)} label={props.label} onChange={(newDate : Dayjs | null) => {
                if (newDate){
                    props.setDate(newDate.toDate());
                }
            }}>

            </DatePicker>
        </LocalizationProvider>
    )
}