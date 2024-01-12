import styles from "./Button.module.css";
function Button({ children, onClickEvent, typeClass }) {
  return (
    <button onClick={onClickEvent} className={`${styles[typeClass]} ${styles.btn}`}>
      {children}
    </button>
  );
}

export default Button;
