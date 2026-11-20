import { useEffect, useRef } from "react"

export default function ConfirmationModal({ modalData }) {
  const panel = useRef(null)
  useEffect(() => {
    const previous = document.activeElement
    const dialog = panel.current
    dialog?.querySelector("button")?.focus()
    const keyboard = (event) => {
      if (event.key === "Escape") modalData.btn2Handler?.()
      if (event.key === "Tab") {
        const buttons = dialog.querySelectorAll("button")
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", keyboard)
    return () => {
      document.removeEventListener("keydown", keyboard)
      previous?.focus?.()
    }
  }, [modalData])
  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) modalData.btn2Handler?.()
      }}
    >
      <section
        className="modal-panel"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
      >
        <h2 id="confirmation-title">{modalData.text1}</h2>
        <p id="confirmation-description">{modalData.text2}</p>
        <div className="modal-actions">
          <button
            className="button button-primary"
            onClick={modalData.btn1Handler}
          >
            {modalData.btn1Text}
          </button>
          <button
            className="button button-secondary"
            onClick={modalData.btn2Handler}
          >
            {modalData.btn2Text}
          </button>
        </div>
      </section>
    </div>
  )
}
