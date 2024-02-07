import { Stack, Typography, Button } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
interface ButtonInSummaryRowProps{
    text : string;
    onClick : () => void;
}

export const ButtonInSummaryRow : React.FC<ButtonInSummaryRowProps> = (props : ButtonInSummaryRowProps) => {
    return (
        <Stack direction="row" style={{border : "1px solid black", marginLeft : 8, marginRight : 8}}>
            <Typography style={{marginTop : 6, marginLeft : 4}}>{props.text}</Typography>
            <Button onClick={props.onClick}>
                <MoreVert/>
            </Button>
        </Stack>
    )

}
