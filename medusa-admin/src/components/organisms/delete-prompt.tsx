import React, { useState } from "react"

import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import Button from "../fundamentals/button"
import Modal from "../molecules/modal"

type DeletePromptProps = {
  heading?: string
  text?: string
  successText?: string | false
  cancelText?: string
  confirmText?: string
  handleClose: () => void
  onDelete: () => Promise<unknown>
}

const DeletePrompt: React.FC<DeletePromptProps> = ({
  heading = "Kas soovite kindlasti kustutada?",
  text = "",
  successText = "Kustutamine õnnestus",
  cancelText = "Ei, tühista",
  confirmText = "Jah, eemalda",
  handleClose,
  onDelete,
}) => {
  const notification = useNotification()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    setIsLoading(true)
    onDelete()
      .then(() => {
        if (successText) {
          notification("Õnnestus", successText, "success")
        }
      })
      .catch((err) => notification("Viga", getErrorMessage(err), "error"))
      .finally(() => {
        setIsLoading(false)
        handleClose()
      })
  }

  return (
    <Modal isLargeModal={false} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-large-semibold">{heading}</span>
            <span className="inter-base-regular text-grey-50 mt-1">{text}</span>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="gap-x-xsmall flex h-8 w-full justify-end">
            <Button
              variant="secondary"
              className="justify-center"
              size="small"
              onClick={handleClose}
            >
              {cancelText}
            </Button>
            <Button
              loading={isLoading}
              size="small"
              className="justify-center"
              variant="nuclear"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default DeletePrompt
