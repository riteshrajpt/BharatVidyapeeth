export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses = "",
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`button ${
        outline ? "button-secondary" : "button-primary"
      } ${customClasses}`}
      type={type}
    >
      <span>{text}</span>
      {children}
    </button>
  )
}
