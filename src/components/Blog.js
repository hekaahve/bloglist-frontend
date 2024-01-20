import { useState } from "react";

const Blog = ({ blog }) => {
  const [buttonLabel, setButtonLabel] = useState("View");
  const [view, setView] = useState(0);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleView = () => {
    if (view === 0 && buttonLabel === "View") {
      setButtonLabel("Hide");
      setView(1);
    } else {
      setView(0);
      setButtonLabel("View");
    }
  };
  return (
    <div style={blogStyle}>
      {blog.title}
      <button onClick={handleView}>{buttonLabel}</button>
      <br></br>
      {view === 1 && (
        <div className="blog_details">
          {blog.url} {blog.author}
        </div>
      )}
    </div>
  );
};

export default Blog;
