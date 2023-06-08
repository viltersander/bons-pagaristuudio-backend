import {
  DeepMap,
  FieldError,
  FieldValues,
  SubmitErrorHandler,
} from "react-hook-form"
import { toast as Controller } from "react-hot-toast"
import FormErrorToaster from "../components/molecules/form-error-toaster"

export const handleFormError: SubmitErrorHandler<FieldValues> = (errors) => {
  const { title, list, refs } = getFormErrors(errors)

  if (refs?.[0] && refs[0].focus) {
    refs[0].focus()
  }

  Controller.custom(
    (t) => <FormErrorToaster toast={t} message={list} title={title} />,
    {
      position: "top-right",
      duration: 3000,
      ariaProps: {
        role: "alert",
        "aria-live": "polite",
      },
    }
  )
}

function getFormErrors(errors: DeepMap<FieldValues, FieldError>) {
  const messages: string[] = Object.values(errors).reduce(
    (acc, { message }) => {
      if (message) {
        acc.push(message)
      }

      return acc
    },
    []
  )

  const refs = Object.values(errors).reduce((acc, { ref }) => {
    if (ref) {
      acc.push(ref)
    }

    return acc
  }, [])

  const list = (
    <ul className="list-inside list-disc">
      {messages.map((m) => (
        <li>{m}</li>
      ))}
    </ul>
  )

  const title =
    messages.length > 1
      ? `Teie esildises oli ${messages.length} viga`
      : "Teie esitamisel ilmnes viga"

  return { title, list, refs }
}
