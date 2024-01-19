import { useState } from "react";

const BlogForm = ({ handleSubmit, user }) => {
  const [newBlog, setNewBlog] = useState("a new blog....");
  const [newUrl, setNewUrl] = useState("a new url....");

  const addBlog = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);
    handleSubmit({
      title: newBlog,
      author: user.name,
      url: newUrl,
      likes: 3,
    });
    setNewBlog("");
    setNewUrl("");
  };

  console.log(newBlog);
  return (
    <form onSubmit={addBlog}>
      <input
        value={newBlog}
        onChange={(event) => setNewBlog(event.target.value)}
      />
      <input
        value={newUrl}
        onChange={(event) => setNewUrl(event.target.value)}
      />
      <button type="submit">save</button>
    </form>
  );
};

export default BlogForm;
