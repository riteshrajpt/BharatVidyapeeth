import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"

import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import PasswordField from "./PasswordField"

export default function SignupForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [params] = useSearchParams()
  const { loading } = useSelector((state) => state.auth)
  const [accountType, setAccountType] = useState(
    params.get("role") === "instructor"
      ? ACCOUNT_TYPE.INSTRUCTOR
      : ACCOUNT_TYPE.STUDENT
  )
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  const submit = (event) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword)
      return toast.error("Your passwords don’t match. Please check them.")
    dispatch(setSignupData({ ...form, email: form.email.trim(), accountType }))
    dispatch(sendOtp(form.email.trim(), navigate))
  }
  return (
    <>
      <div
        className="segmented-control"
        role="group"
        aria-label="Choose your account type"
      >
        {[ACCOUNT_TYPE.STUDENT, ACCOUNT_TYPE.INSTRUCTOR].map((type) => (
          <button
            key={type}
            type="button"
            aria-pressed={accountType === type}
            className={accountType === type ? "selected" : ""}
            onClick={() => setAccountType(type)}
          >
            {type === ACCOUNT_TYPE.STUDENT
              ? "I want to learn"
              : "I want to teach"}
          </button>
        ))}
      </div>
      <form className="auth-form" onSubmit={submit}>
        <div className="field-row">
          {[
            ["firstName", "First name", "given-name"],
            ["lastName", "Last name", "family-name"],
          ].map(([name, label, autocomplete]) => (
            <label className="field" key={name}>
              <span>{label}</span>
              <input
                className="form-style"
                name={name}
                required
                value={form[name]}
                onChange={change}
                placeholder={label}
                autoComplete={autocomplete}
              />
            </label>
          ))}
        </div>
        <label className="field">
          <span>Email address</span>
          <input
            className="form-style"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={change}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <PasswordField
          label="Create password"
          value={form.password}
          onChange={change}
          autoComplete="new-password"
          minLength={8}
        />
        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={change}
          autoComplete="new-password"
          minLength={8}
        />
        <button
          className="button button-primary button-full"
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Sending your verification code…" : "Create my account"}
        </button>
      </form>
    </>
  )
}
