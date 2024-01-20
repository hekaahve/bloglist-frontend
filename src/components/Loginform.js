import { useState } from "react";
import loginService from "../services/login";

const LoginForm = ({ handleSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      handleSubmit({ user });
      setUsername("");
      setPassword("");
    } catch (exception) {
      const unauthorized = "Wrong credentials";
      handleSubmit({ unauthorized });
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={loginUser}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
