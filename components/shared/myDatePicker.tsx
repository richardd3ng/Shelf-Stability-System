import { DatePickerProps, DateValidationError, LocalizationProvider, PickerChangeHandlerContext } from "@mui/x-date-pickers"
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs"
import dayjs from "dayjs";
import { LocalDate, nativeJs } from "@js-joda/core";

export type MyDatePickerProps = {
    onChange?: ((value: LocalDate | null, context: PickerChangeHandlerContext<DateValidationError>) => void);
    value?: LocalDate | null;
    defaultValue?: LocalDate | null;
} & Omit<DatePickerProps<Dayjs>, "value" | "onChange" | "defaultValue"> & React.RefAttributes<HTMLDivElement>;

export const MyDatePicker: React.FC<MyDatePickerProps> = props => {
    return (
        <DatePicker
            timezone="UTC"
            {...props}
            value={props.value === null || props.value === undefined ? props.value : dayjs(props.value.toString())}
            defaultValue={props.defaultValue === null || props.defaultValue === undefined ? props.defaultValue : dayjs(props.defaultValue.toString())}
            onChange={(newDate: Dayjs | null, context) => {
                if (props.onChange !== undefined) {
                    props.onChange(newDate !== null ? nativeJs(newDate).toLocalDate() : newDate, context);
                }
            }}
        >
        </DatePicker>
    )
}