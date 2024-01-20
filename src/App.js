import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Toggable from "./components/Toggable";
import LoginForm from "./components/Loginform";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import Notification from "./components/Notification";
// TODO: tehtävät 5.7 - 5.11
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("Hello blogs");
  const [user, setUser] = useState(null);

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
  const handleLogin = (loggedUser) => {
    if (loggedUser.unauthorized) {
      setErrorMessage(loggedUser.unauthorized);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } else {
      window.localStorage.setItem(
        "loggedBlogsappUser",
        JSON.stringify(loggedUser.user)
      );
      blogService.setToken(loggedUser.user.token);
      setUser(loggedUser.user);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogsappUser");
    setUser(null);
    window.location.reload(false);
  };

  const filteredBlogs = () => {
    const filtered = blogs.filter((items) => items.author === user.name);
    const userBlogs = filtered.map((blog) => (
      <Blog key={blog.id} blog={blog} />
    ));
    return userBlogs;
  };

  return (
    <div>
      <Notification message={errorMessage} />
      <h2>Blogs</h2>
      {user ? (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={() => handleLogout()}>Logout</button>{" "}
          {filteredBlogs()}
          <Toggable buttonLabel="New Blog" cancel="cancel">
            <BlogForm handleSubmit={addBlog} user={user} />
          </Toggable>
        </div>
      ) : (
        <Toggable buttonLabel="Log in" cancel="cancel">
          <LoginForm handleSubmit={handleLogin} />
        </Toggable>
      )}
    </div>
  );
};

export default App;
