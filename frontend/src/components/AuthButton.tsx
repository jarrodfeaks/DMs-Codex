import { LoginStatus } from "../types.ts";
import {Button} from "@mui/material";

export default function AuthButton({ loginStatus }: { loginStatus: LoginStatus }) {
    const [ href, text ] = loginStatus === LoginStatus.LoggedIn ? ["/api/logout", "Logout"] : ["/api/login", "Login"];
    const isDisabled = loginStatus === LoginStatus.Fetching || loginStatus === LoginStatus.Error;

    return (
        <a href={href}>
            <Button variant="contained" disabled={isDisabled}>{text}</Button>
        </a>
    );
}
