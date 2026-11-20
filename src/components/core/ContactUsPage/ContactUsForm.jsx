import { useState } from "react"
import { useForm } from "react-hook-form"

import { apiConnector } from "../../../services/apiConnector"
import { contactusEndpoint } from "../../../services/apis"

export default function ContactUsForm() {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { countrycode: "+91" } })
  const submit = async (data) => {
    setLoading(true)
    setFeedback(null)
    try {
      const response = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      )
      if (!response.data.success) throw new Error("Unable to send")
      setFeedback({
        success: true,
        message:
          "Your message was received. Check your inbox for a confirmation.",
      })
      reset({
        firstname: "",
        lastname: "",
        email: "",
        countrycode: "+91",
        phoneNo: "",
        message: "",
      })
    } catch {
      setFeedback({
        success: false,
        message:
          "We couldn’t send your message. Please try again or email us directly.",
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <form className="auth-form" onSubmit={handleSubmit(submit)}>
      <div className="field-row">
        {[
          ["firstname", "First name", true, "given-name"],
          ["lastname", "Last name", false, "family-name"],
        ].map(([name, label, required, autocomplete]) => (
          <div className="field" key={name}>
            <label className="field-label" htmlFor={`contact-${name}`}>
              {label}
              {!required && " (optional)"}
            </label>
            <input
              className="form-style"
              id={`contact-${name}`}
              autoComplete={autocomplete}
              placeholder={label}
              aria-invalid={!!errors[name]}
              {...register(name, { required })}
            />
            {errors[name] && (
              <span className="form-error" role="alert">
                Please enter your first name.
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="field">
        <label className="field-label" htmlFor="contact-email">
          Email address
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          className="form-style"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="form-error" role="alert">
            Please enter your email address.
          </span>
        )}
      </div>
      <div className="field">
        <label className="field-label" htmlFor="contact-phone">
          Phone number
        </label>
        <div className="contact-phone">
          <input
            aria-label="Country calling code"
            className="form-style"
            autoComplete="tel-country-code"
            {...register("countrycode", {
              required: true,
              pattern: /^\+?\d{1,4}$/,
            })}
          />
          <input
            id="contact-phone"
            className="form-style"
            type="tel"
            autoComplete="tel-national"
            placeholder="Your phone number"
            aria-invalid={!!errors.phoneNo}
            {...register("phoneNo", {
              required: true,
              pattern: /^[\d\s()+-]{7,20}$/,
            })}
          />
        </div>
        {(errors.phoneNo || errors.countrycode) && (
          <span className="form-error" role="alert">
            Please enter a valid phone number and country code.
          </span>
        )}
      </div>
      <div className="field">
        <label className="field-label" htmlFor="contact-message">
          What’s on your mind?
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className="form-style"
          placeholder="Tell us a little about how we can help…"
          aria-invalid={!!errors.message}
          {...register("message", { required: true, maxLength: 5000 })}
        />
        {errors.message && (
          <span className="form-error" role="alert">
            Please include a message, up to 5,000 characters.
          </span>
        )}
      </div>
      {feedback && (
        <div
          className={feedback.success ? "form-feedback" : "form-error"}
          role="status"
        >
          {feedback.message}
        </div>
      )}
      <button
        className="button button-primary button-full"
        type="submit"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Sending your message…" : "Send my message"}
      </button>
    </form>
  )
}
