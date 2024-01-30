import * as React from "react";
import {
    Box,
    Checkbox,
    Chip,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface MultiSelectDropdownProps {
    items: string[];
    label: string;
    size?: "small" | "medium";
    onChange: (selectedItems: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = (
    props: MultiSelectDropdownProps
) => {
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
    const isSmall = props.size === "small";
    const sizeConfig = {
        labelFontSize: isSmall ? "0.75rem" : "1rem",
        itemHeight: isSmall ? 24 : 48,
        itemPaddingTop: isSmall ? -12 : 8,
        width: isSmall ? 120 : 400,
        menuWidth: isSmall ? 120 : 300,
        marginY: isSmall ? 1 : 0,
    };

    const handleChange = (event: SelectChangeEvent<typeof selectedItems>) => {
        const {
            target: { value },
        } = event;
        const newSelectedItems =
            typeof value === "string" ? value.split(",") : value;
        setSelectedItems(newSelectedItems);
        props.onChange(newSelectedItems);
    };

    return (
        <FormControl
            sx={{
                width: sizeConfig.width,
                my: sizeConfig.marginY,
            }}
            size={props.size}
        >
            <InputLabel
                id="dropdown-label"
                sx={
                    isSmall
                        ? {
                              fontSize: sizeConfig.labelFontSize,
                              paddingTop: 0.25,
                          }
                        : {}
                }
            >
                {props.label}
            </InputLabel>
            <Select
                labelId="multiple-chip-label"
                id="multiple-chip"
                multiple
                value={selectedItems}
                onChange={handleChange}
                input={
                    <OutlinedInput
                        id="select-multiple-chip"
                        label={props.label}
                    />
                }
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip
                                key={value}
                                label={value}
                                sx={
                                    isSmall
                                        ? {
                                              fontSize: "0.5rem",
                                              height: "0.75rem",
                                          }
                                        : {}
                                }
                                size={props.size}
                            />
                        ))}
                    </Box>
                )}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight:
                                sizeConfig.itemHeight * 4.5 +
                                sizeConfig.itemPaddingTop,
                            width: sizeConfig.menuWidth,
                        },
                    },
                }}
            >
                {props.items.map((item) => (
                    <MenuItem
                        key={item}
                        value={item}
                        sx={
                            isSmall
                                ? {
                                      height: 30,
                                      justifyContent: "left",
                                      alignItems: "center",
                                      marginLeft: -2.5,
                                  }
                                : {}
                        }
                    >
                        <Checkbox
                            checked={selectedItems.indexOf(item) > -1}
                            size={props.size}
                        />
                        <ListItemText
                            primary={item}
                            primaryTypographyProps={
                                isSmall ? { fontSize: "0.75rem" } : {}
                            }
                        />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MultiSelectDropdown;