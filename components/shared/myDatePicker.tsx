import {
    DatePickerProps,
    DateValidationError,
    PickerChangeHandlerContext,
} from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { LocalDate, ZoneId, nativeJs } from "@js-joda/core";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export type MyDatePickerProps = {
    onChange?: (
        value: LocalDate | null,
        context: PickerChangeHandlerContext<DateValidationError>
    ) => void;
    value?: LocalDate | null;
    defaultValue?: LocalDate | null;
    required?: boolean;
} & Omit<DatePickerProps<Dayjs>, "value" | "onChange" | "defaultValue"> &
    React.RefAttributes<HTMLDivElement>;

export const MyDatePicker: React.FC<MyDatePickerProps> = (props) => {
    return (
        <DatePicker
            timezone="UTC"
            format="YYYY-MM-DD"
            slotProps={{
                actionBar: { actions: ["today", "clear"] },
                textField: {
                    required: props.required,
                },
            }}
            {...props}
            value={
                props.value === null || props.value === undefined
                    ? props.value
                    : dayjs(props.value.toString())
            }
            defaultValue={
                props.defaultValue === null || props.defaultValue === undefined
                    ? props.defaultValue
                    : dayjs(props.defaultValue.toString())
            }
            onChange={(newDate: Dayjs | null, context) => {
                if (props.onChange !== undefined) {
                    try {
                        props.onChange(
                            newDate !== null
                                ? nativeJs(newDate, ZoneId.UTC).toLocalDate()
                                : newDate,
                            context
                        );
                    } catch (error) {
                        props.onChange(null, context);
                    }
                }
            }}
        />
    );
};
