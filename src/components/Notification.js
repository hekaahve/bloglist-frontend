const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  //TODO: Fix errorNote's color based on response status (400 or 200)
  let errorNote = false;
  if (message.includes("wrong credentials")) {
    errorNote = true;
  }

  const styles = {
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    bordeRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
    color: errorNote ? "red" : "green",
  };

  return (
    <div className="error" style={styles}>
      {message}
    </div>
  );
};
export default Notification;
