import React, { useEffect, useState } from 'react';
import './Landing.css';

function Landing() {
    const [loading, setLoading] = useState(true);
    const [loginStatus, setLoginStatus] = useState<string>("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/profile');
                if (res.status === 401) {
                    setLoginStatus("/api/login");
                } else {
                    setLoginStatus("/api/logout");
                }
            } catch (err) {
                console.error("Error authenticating:", err);
                setLoginStatus("/api/login"); 
            }
        }

        checkAuth();
    }, []);

    return (        
        <div className={`background-page ${loading ? 'loading' : 'loaded'}`}>
            <div className="overlay"></div>
            <div className="landing-page">
                <h1> Dungeon Master's <br /> Codex</h1>
                <a href={loginStatus} className="login-button">
                    <button>{loginStatus.includes("logout") ? "Logout" : "Enter"}</button>
                </a>
            </div>
        </div>     
    );
}

export default Landing;
