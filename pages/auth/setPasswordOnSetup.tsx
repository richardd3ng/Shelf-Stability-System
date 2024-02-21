import React, {useState} from "react";
import { Button, Container, Typography } from "@mui/material";
import { AuthForm } from "@/components/shared/authForm";
import { ErrorMessage } from "@/components/shared/errorMessage";
import { YourButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { useMutationToSetPasswordOnSetup } from "@/lib/hooks/authPages/setPasswordOnSetupHooks";
import { checkIfAdminExists } from "@/lib/api/auth/authHelpers";

export default function SetPasswordOnSetupPage(){
    const [password1, setPassword1] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const {mutate : setPassword, isPending, isError, error} = useMutationToSetPasswordOnSetup();
    return (
        <Container maxWidth="sm" style={{marginTop : 20, paddingTop : 20}}>
            
            <AuthForm 
                fields={[
                    {
                        value : password1,
                        setValue : setPassword1,
                        label : "Password",
                        shouldBlurText : true
                    },
                    {
                        value : password2,
                        setValue : setPassword2,
                        label : "Confirm Password",
                        shouldBlurText : true
                    }
                ]}
                title="Set Admin Password"
            />
            {
                (password1 !== password2) && (password1.length > 0 && password2.length > 0)
                ? 
                <ErrorMessage message="Passwords do not match"/>
                : 
                null
            }
            <YourButtonWithLoadingAndError isLoading={isPending} isError={isError} error={error}>
                <Button variant="contained" color="primary" disabled={password1 !== password2 || (password1.length < 1 || password2.length < 1)} onClick={
                    () => {setPassword({newPassword : password1})}
                }>
                    <Typography>
                        Submit
                    </Typography>
                </Button>
            </YourButtonWithLoadingAndError>

		</Container>
    )
}

export async function getServerSideProps(){
    try{
        const passwordHasBeenSet = await checkIfAdminExists();
        if (passwordHasBeenSet){
            return {
                redirect : {
                    destination: '/auth/updatePassword',
                    permanent: false,
                },
            }
        } else {
            return {props : {}};
        }
    } catch {
        return {
            redirect : {
                destination: '/auth/updatePassword',
                permanent: false,
            },
        }
    }
    
}