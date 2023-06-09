import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/Loginform";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState("a new blog....");
  const [newUrl, setNewUrl] = useState("a new url....");
  const [newAuthor, setNewAuthor] = useState("a new url....");
  const [errorMessage, setErrorMessage] = useState("Hello blogs");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogsappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = (event) => {
    event.preventDefault(); //estää sivun uudelleenlatautumisen
    console.log("button clicked", event.target);
    const blogObject = {
      title: newBlog,
      author: user.name,
      url: newUrl,
      likes: 3,
    };
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setNewBlog("");
    });
    setErrorMessage("A new blog " + blogObject.title + " added");
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleBlogChange = (event) => {
    console.log(event.target.value); //target viittaa input-kenttään
    setNewBlog(event.target.value); //event.target.value viittaa inputin syötekentän arvoon.
  };

  const handleUrlChange = (event) => {
    console.log(event.target.value); //target viittaa input-kenttään
    setNewUrl(event.target.value); //event.target.value viittaa inputin syötekentän arvoon.
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogsappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogsappUser");
    setUser(null);
    window.location.reload(false);
  };

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <input value={newBlog} onChange={handleBlogChange} />
      <input value={newUrl} onChange={handleUrlChange} />
      <button type="submit">save</button>
    </form>
  );

  return (
    <div>
      <Notification message={errorMessage} />
      <h2>Blogs</h2>
      {user ? (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={() => handleLogout()}>Logout</button>{" "}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} /> //FIX: shows all blogs, not just the users
          ))}
          {blogForm()}
        </div>
      ) : (
        loginForm()
      )}
    </div>
  );
};

export default App;
