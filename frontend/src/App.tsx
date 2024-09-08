import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface User {
    sid: string; // session ID
    nickname: string;
    name: string;
    picture: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
    sub: string; // user ID
}

enum LoginStatus {
    Fetching,
    LoggedIn,
    LoggedOut,
    Error
}

function AuthButton({ loginStatus }: { loginStatus: LoginStatus }) {
    const [ href, text ] = loginStatus === LoginStatus.LoggedIn ? ["/api/logout", "Logout"] : ["/api/login", "Login"];
    const isDisabled = loginStatus === LoginStatus.Fetching || loginStatus === LoginStatus.Error;

    return (
        <a href={href}>
            <button disabled={isDisabled}>{text}</button>
        </a>
    );
}

function App() {
    const [count, setCount] = useState(0);

    const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.Fetching);
    const [user, setUser] = useState<User | undefined>();

    const userStatus = () => {
        switch (loginStatus) {
            case LoginStatus.Fetching:
                return "Fetching...";
            case LoginStatus.LoggedIn:
                return `Logged in as ${user?.name}`;
            case LoginStatus.LoggedOut:
                return "Logged out";
            case LoginStatus.Error:
                return "Error authenticating";
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/profile');
                if (res.status === 401) {
                    setLoginStatus(LoginStatus.LoggedOut);
                } else {
                    const data = await res.json();
                    console.log(data);
                    setUser(data);
                    setLoginStatus(LoginStatus.LoggedIn);
                }
            } catch (err) {
                console.error("Error authenticating:", err);
                setLoginStatus(LoginStatus.Error);
            }
        }

        checkAuth();
    }, []);

    // const readDatabase = async () => {
    //     try {
    //         const res = await fetch('/api/test/db');
    //         const data = await res.json();
    //         console.log(data);
    //     } catch (err) {
    //         console.error("Error reading database:", err);
    //     }
    // }

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            {/*<button onClick={readDatabase}>Read Database</button>*/}
            <p><strong>User Status:</strong> {userStatus()}</p>
            <AuthButton loginStatus={loginStatus} />
        </>
    )
}

export default App
