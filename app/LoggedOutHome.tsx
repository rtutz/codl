import Login from "./auth/Login";

export default function LoggedOutHome() {
    return (
        <div>
            <h1>Please Log in</h1>
            <Login/>
        </div>
    )
}