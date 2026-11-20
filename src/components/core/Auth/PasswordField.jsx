import { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"

export default function PasswordField({
  label = "Password",
  name = "password",
  value,
  onChange,
  autoComplete = "current-password",
  minLength,
}) {
  const [visible, setVisible] = useState(false)
  const id = `auth-${name}`
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="password-field">
        <input
          className="form-style"
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          minLength={minLength}
          placeholder={label === "Password" ? "Enter your password" : label}
        />
        <button
          type="button"
          className="icon-button"
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  )
}
