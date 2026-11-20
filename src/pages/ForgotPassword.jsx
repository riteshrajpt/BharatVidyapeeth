import { useState } from "react"
import { FiCheckCircle, FiMail } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import AuthCard from "../components/core/Auth/AuthCard"
import { getPasswordResetToken } from "../services/operations/authAPI"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const { loading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  return (
    <AuthCard
      icon={sent ? FiCheckCircle : FiMail}
      eyebrow="LET’S GET YOU BACK TO LEARNING"
      title={sent ? "Check your inbox." : "A fresh start for your password."}
      description={
        sent
          ? `We’ve sent a password-reset link to ${email}. Open it on this computer to choose a new password. The link expires in one hour.`
          : "It happens. Enter the email address you signed up with and we’ll send you a link to reset your password."
      }
    >
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault()
          dispatch(getPasswordResetToken(email.trim(), setSent))
        }}
      >
        {!sent && (
          <label className="field">
            <span>Email address</span>
            <input
              className="form-style"
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
        )}
        <button
          className="button button-primary button-full"
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading
            ? "Sending your link…"
            : sent
            ? "Resend reset email"
            : "Send reset link"}
        </button>
      </form>
      {sent && (
        <p className="auth-footnote">
          Can’t see it? Take a look in your spam folder.
        </p>
      )}
    </AuthCard>
  )
}
