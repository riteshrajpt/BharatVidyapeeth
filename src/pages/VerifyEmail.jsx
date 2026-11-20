import { useEffect, useState } from "react"
import { FiMail } from "react-icons/fi"
import OtpInput from "react-otp-input"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import AuthCard from "../components/core/Auth/AuthCard"
import { sendOtp, signUp } from "../services/operations/authAPI"

export default function VerifyEmail() {
  const [otp, setOtp] = useState("")
  const { signupData, loading } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    if (!signupData) navigate("/signup", { replace: true })
  }, [signupData, navigate])
  if (!signupData) return null
  const submit = (event) => {
    event.preventDefault()
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData
    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    )
  }
  return (
    <AuthCard
      icon={FiMail}
      eyebrow="ONE LAST LITTLE STEP"
      title="Your inbox has the key."
      description={`Enter the 6-digit verification code we sent to ${signupData.email}.`}
      backTo="/signup"
      backLabel="Back to sign up"
    >
      <form className="auth-form" onSubmit={submit}>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          inputType="tel"
          containerStyle="otp-inputs"
          renderInput={(props) => (
            <input
              {...props}
              required
              inputMode="numeric"
              aria-label={props["aria-label"]}
            />
          )}
        />
        <button
          className="button button-primary button-full"
          disabled={loading || otp.length !== 6}
          aria-busy={loading}
          type="submit"
        >
          {loading ? "Verifying your email…" : "Verify and start learning"}
        </button>
      </form>
      <div className="otp-actions">
        <span>Didn’t get the code?</span>
        <button
          className="text-link"
          disabled={loading}
          onClick={() => dispatch(sendOtp(signupData.email, navigate))}
        >
          Send a new code
        </button>
      </div>
    </AuthCard>
  )
}
