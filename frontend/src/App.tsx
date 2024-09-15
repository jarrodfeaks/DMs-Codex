// import {useEffect, useState} from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import CharacterSheet from './CharacterSheet'

// interface User {
//     sid: string; // session ID
//     nickname: string;
//     name: string;
//     picture: string;
//     updated_at: string;
//     email: string;
//     email_verified: boolean;
//     sub: string; // user ID
// }

// enum LoginStatus {
//     Fetching,
//     LoggedIn,
//     LoggedOut,
//     Error
// }

// function AuthButton({ loginStatus }: { loginStatus: LoginStatus }) {
//     const [ href, text ] = loginStatus === LoginStatus.LoggedIn ? ["/api/logout", "Logout"] : ["/api/login", "Login"];
//     const isDisabled = loginStatus === LoginStatus.Fetching || loginStatus === LoginStatus.Error;

//     return (
//         <a href={href}>
//             <button disabled={isDisabled}>{text}</button>
//         </a>
//     );
// }

function App() {
    // const [count, setCount] = useState(0);

    // const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.Fetching);
    // const [user, setUser] = useState<User | undefined>();

    // const userStatus = () => {
    //     switch (loginStatus) {
    //         case LoginStatus.Fetching:
    //             return "Fetching...";
    //         case LoginStatus.LoggedIn:
    //             return `Logged in as ${user?.name}`;
    //         case LoginStatus.LoggedOut:
    //             return "Logged out";
    //         case LoginStatus.Error:
    //             return "Error authenticating";
    //     }
    // }

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const res = await fetch('/api/profile');
    //             if (res.status === 401) {
    //                 setLoginStatus(LoginStatus.LoggedOut);
    //             } else {
    //                 const data = await res.json();
    //                 console.log(data);
    //                 setUser(data);
    //                 setLoginStatus(LoginStatus.LoggedIn);
    //             }
    //         } catch (err) {
    //             console.error("Error authenticating:", err);
    //             setLoginStatus(LoginStatus.Error);
    //         }
    //     }

    //     checkAuth();
    // }, []);

    // // const readDatabase = async () => {
    // //     try {
    // //         const res = await fetch('/api/test/db');
    // //         const data = await res.json();
    // //         console.log(data);
    // //     } catch (err) {
    // //         console.error("Error reading database:", err);
    // //     }
    // // }

    return (
        <>
            <CharacterSheet/>
        </>
    )
}

export default App
