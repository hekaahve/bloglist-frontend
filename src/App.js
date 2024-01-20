import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Toggable from "./components/Toggable";
import LoginForm from "./components/Loginform";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
// TODO: tehtävät 5.7 - 5.11
const App = () => {
  const [blogs, setBlogs] = useState([]);
  //const [newAuthor, setNewAuthor] = useState("a new url....");
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

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
    });
    setErrorMessage("A new blog " + blogObject.title + " added");
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };
  const handleLogin = (user) => {
    if (user.unauthorized) {
      setErrorMessage(user.unauthorized);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } else {
      window.localStorage.setItem("loggedBlogsappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogsappUser");
    setUser(null);
    window.location.reload(false);
  };

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
          <Toggable buttonLabel="New Blog">
            <BlogForm handleSubmit={addBlog} user={user} />
          </Toggable>
        </div>
      ) : (
        <Toggable buttonLabel="Log in">
          <LoginForm handleSubmit={handleLogin} />
        </Toggable>
      )}
    </div>
  );
};

export default App;
