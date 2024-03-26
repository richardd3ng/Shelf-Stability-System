import { useAllUsers } from "@/lib/hooks/useAllUsers"
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { UserInfo } from "@/lib/controllers/types";

interface UserSelectorProps {
    userId : number;
    setUserId : (n : number) => void;
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
                onChange={(e) => props.setUserId(Number(e.target.value))}
            >

                {users.map((user: UserInfo) => (
                    <MenuItem key={user.id} value={user.id}>
                        {user.displayName}
                    </MenuItem>
                ))}

            </Select>
        </FormControl>
    )
}
