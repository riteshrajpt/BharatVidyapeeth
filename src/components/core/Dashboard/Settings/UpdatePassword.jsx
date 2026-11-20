import { useState } from "react"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { changePassword } from "../../../../services/operations/SettingsAPI"
import PasswordField from "../../Auth/PasswordField"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const [form, setForm] = useState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }),
    [loading, setLoading] = useState(false)
  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  const submit = async (event) => {
    event.preventDefault()
    if (form.newPassword !== form.confirmPassword)
      return toast.error("Your new passwords don’t match.")
    setLoading(true)
    try {
      const success = await changePassword(token, {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      })
      if (success)
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
    } finally {
      setLoading(false)
    }
  }
  return (
    <section className="surface-card">
      <div className="surface-heading">
        <h2>Keep your account yours</h2>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <PasswordField
          label="Current password"
          name="oldPassword"
          value={form.oldPassword}
          onChange={change}
        />
        <div className="field-row">
          <PasswordField
            label="New password"
            name="newPassword"
            value={form.newPassword}
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
        </div>
        <div className="modal-actions">
          <Link to="/dashboard/my-profile" className="button button-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Updating your password…" : "Update password"}
          </button>
        </div>
      </form>
    </section>
  )
}
