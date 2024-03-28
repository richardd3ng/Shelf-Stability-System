import { useAllUsers } from "@/lib/hooks/useAllUsers"
import { Select, MenuItem, FormControl, InputLabel, Typography } from "@mui/material";
import { UserInfo } from "@/lib/controllers/types";

interface UserSelectorProps {
    userId : number;
    setUserId : (n : number | null) => void;
    includeNoneOption : boolean;
}
const noneUser : UserInfo = {
    username : "None",
    displayName : "None",
    isAdmin : false,
    isSSO : false,
    id : -1,
    email : ""
}


export const UserSelector : React.FC<UserSelectorProps> = (props : UserSelectorProps) => {
    const {data : users} = useAllUsers();
    if (!users){
        return null;
    }
    return (
        <FormControl fullWidth>
            <InputLabel id="Technician" required>
                Technician
            </InputLabel>
            <Select
                id="Technician"
                value={props.userId}
                label="Technician"
                onChange={(e) => {
                    if (Number(e.target.value) >= 0){
                        props.setUserId(Number(e.target.value))
                    } else {
                        props.setUserId(null);
                    }
                    
                }}
           
            >
                {
                    props.includeNoneOption 
                    ?
                    [...users, noneUser].map((user : UserInfo) => (
                        <MenuItem key={user.id} value={user.id}>
                            {user.id >= 0
                            ?
                            user.displayName + " (" + user.username + ")"
                            :
                            <Typography color="red">{user.displayName}</Typography>
                            }
                            
                        </MenuItem>
                    ))
                    : 
                    users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                            {user.displayName + " (" + user.username + ")"}
                        </MenuItem>
                    ))
                }
                

            </Select>
        </FormControl>
    )
}
