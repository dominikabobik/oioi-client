import styles from "./Bubble.module.css";

const Bubble = ({ username, text, self }) => {
  return (
    <div
      style={{
        width: "fit-content",
        display: "flex",
        flexDirection: "column",
        marginRight: self ? "0" : "auto",
        marginLeft: self ? "auto" : "0",
      }}
    >
      <div
        style={{
          width: "100%",
          textAlign: self ? "right" : "left",
        }}
      >
        {username}
      </div>
      <div
        className={styles.wrapper}
        style={{
          backgroundColor: self ? "rgb(0, 255, 72)" : "rgb(0, 170, 255)",
        }}
      >
        <div className={styles.text}>{text}</div>
      </div>
    </div>
  );
};

export default Bubble;
