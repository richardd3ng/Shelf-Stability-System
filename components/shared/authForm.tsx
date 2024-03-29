import { Container, Typography, TextField, Stack } from "@mui/material";

interface AuthFieldInfo {
    value: string;
    setValue: (s: string) => void;
    label: string;
    shouldBlurText: boolean;
}
interface AuthFormProps {
    fields: AuthFieldInfo[];
    title: string;
}
export const AuthForm: React.FC<AuthFormProps> = (props: AuthFormProps) => {
    return (
        <Container>
            <Typography
                align="center"
                variant="h3"
                style={{ marginBottom: 24, marginTop: 24 }}
            >
                {props.title}
            </Typography>
            <Stack style={{ marginBottom: 16 }}>
                {props.fields.map((field, index) => {
                    return (
                        <TextField
                            style={{ marginBottom: 8 }}
                            label={field.label}
                            key={index}
                            type={field.shouldBlurText ? "password" : "text"}
                            value={field.value}
                            onChange={(e) => field.setValue(e.target.value)}
                        />
                    );
                })}
            </Stack>
        </Container>
    );
};
