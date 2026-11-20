import { useState } from "react"
import { toast } from "react-hot-toast"
import { FiLock } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import AuthCard from "../components/core/Auth/AuthCard"
import PasswordField from "../components/core/Auth/PasswordField"
import { resetPassword } from "../services/operations/authAPI"

export default function UpdatePassword() {
  const { id: token } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ password: "", confirmPassword: "" })
  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  const submit = (event) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword)
      return toast.error("Your passwords don’t match. Please check them.")
    dispatch(
      resetPassword(form.password, form.confirmPassword, token, navigate)
    )
  }
  return (
    <AuthCard
      icon={FiLock}
      eyebrow="YOUR ACCOUNT, A FRESH START"
      title="Make it memorable. Keep it yours."
      description="Choose a new password with at least 8 characters. Then you’re ready to pick up where you left off."
    >
      <form className="auth-form" onSubmit={submit}>
        <PasswordField
          label="New password"
          value={form.password}
          onChange={change}
          autoComplete="new-password"
          minLength={8}
        />
        <PasswordField
          label="Confirm new password"
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
          {loading ? "Updating your password…" : "Reset my password"}
        </button>
      </form>
    </AuthCard>
  )
}
