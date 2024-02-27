import { useEditGroup } from "@/lib/context/shared/editGroup";
import { Select, SelectProps } from "@mui/material";

export const EditGroupSelect: (<Value>(props: SelectProps<Value> & { id: string }) => JSX.Element) = (props) => {
    const { startEditing, stopEditing } = useEditGroup(props.id, () => {
        // TODO stop editing
    });

    return <Select
        {...props}
        onOpen={(event) => {
            startEditing();
            props.onOpen?.(event);
        }}
        onClose={(event) => {
            stopEditing();
            props.onClose?.(event);
        }}
    >
        {props.children}
    </Select>;
};