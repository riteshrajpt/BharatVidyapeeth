import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"
import PasswordField from "./PasswordField"

export default function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ email: "", password: "" })
  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  return (
    <form
      className="auth-form"
      onSubmit={(event) => {
        event.preventDefault()
        dispatch(
          login(
            form.email.trim(),
            form.password,
            navigate,
            location.state?.from
          )
        )
      }}
    >
      <label className="field">
        <span>Email address</span>
        <input
          type="email"
          className="form-style"
          required
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={change}
        />
      </label>
      <div>
        <PasswordField value={form.password} onChange={change} />
        <Link className="field-utility text-link" to="/forgot-password">
          Forgot your password?
        </Link>
      </div>
      <button
        className="button button-primary button-full"
        disabled={loading}
        aria-busy={loading}
        type="submit"
      >
        {loading ? "Logging you in…" : "Log in to your learning space"}
      </button>
    </form>
  )
}
