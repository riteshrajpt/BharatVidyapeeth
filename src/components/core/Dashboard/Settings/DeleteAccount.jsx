import { useState } from "react"
import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingsAPI"
import ConfirmationModal from "../../../Common/ConfirmationModal"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch(),
    navigate = useNavigate()
  const [confirmation, setConfirmation] = useState(null)
  return (
    <>
      <section className="surface-card danger-card">
        <span className="danger-icon">
          <FiTrash2 />
        </span>
        <div>
          <h2>Close your account</h2>
          <p>
            Deleting your account permanently removes your profile and access to
            your enrolled courses. This can’t be undone.
          </p>
          <button
            className="danger-link"
            onClick={() =>
              setConfirmation({
                text1: "Permanently delete your account?",
                text2:
                  "Your profile and course access will be removed. Your learning history cannot be recovered after this step.",
                btn1Text: "Delete my account",
                btn2Text: "Keep my account",
                btn1Handler: () => dispatch(deleteProfile(token, navigate)),
                btn2Handler: () => setConfirmation(null),
              })
            }
          >
            Delete my account
          </button>
        </div>
      </section>
      {confirmation && <ConfirmationModal modalData={confirmation} />}
    </>
  )
}
