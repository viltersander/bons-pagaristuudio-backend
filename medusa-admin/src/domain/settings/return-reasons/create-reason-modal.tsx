import { ReturnReason } from "@medusajs/medusa"
import { useAdminCreateReturnReason } from "medusa-react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import TextArea from "../../../components/molecules/textarea"
import useNotification from "../../../hooks/use-notification"
import FormValidator from "../../../utils/form-validator"

type CreateReturnReasonModalProps = {
  handleClose: () => void
  initialReason?: ReturnReason
}

type CreateReturnReasonFormData = {
  value: string
  label: string
  description: string | null
}

// the reason props is used for prefilling the form when duplicating
const CreateReturnReasonModal = ({
  handleClose,
  initialReason,
}: CreateReturnReasonModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReturnReasonFormData>({
    defaultValues: {
      value: initialReason?.value,
      label: initialReason?.label,
      description: initialReason?.description,
    },
  })
  const notification = useNotification()
  const { mutate, isLoading } = useAdminCreateReturnReason()

  const onCreate = (data: CreateReturnReasonFormData) => {
    mutate(
      {
        ...data,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          notification("Õnnestus", "Loodud uus tagastamise põhjus", "success")
        },
        onError: () => {
          notification(
            "Viga",
            "Olemasoleva koodiga ei saa tagastamispõhjust luua",
            "error"
          )
        },
      }
    )
    handleClose()
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Lisa põhjus</span>
        </Modal.Header>
        <form onSubmit={handleSubmit(onCreate)}>
          <Modal.Content>
            <div className="gap-large mb-large grid grid-cols-2">
              <Input
                {...register("value", {
                  required: "Väärtus on nõutud",
                  pattern: FormValidator.whiteSpaceRule("Väärtus"),
                  minLength: FormValidator.minOneCharRule("Väärtus"),
                })}
                label="Väärtus"
                required
                placeholder="vale_suurus"
                errors={errors}
              />
              <Input
                {...register("label", {
                  required: "Silt on nõutav",
                  pattern: FormValidator.whiteSpaceRule("Silt"),
                  minLength: FormValidator.minOneCharRule("Silt"),
                })}
                label="Silt"
                required
                placeholder="Vale suurus"
                errors={errors}
              />
            </div>
            <TextArea
              className="mt-large"
              rows={3}
              {...register("description")}
              label="Kirjeldus"
              placeholder="Klient sai vale suuruse"
              errors={errors}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex h-8 w-full justify-end">
              <Button
                variant="ghost"
                className="text-small mr-2 w-32 justify-center"
                size="large"
                onClick={handleClose}
                type="button"
              >
                Tühista
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                size="large"
                className="text-small w-32 justify-center"
                variant="primary"
              >
                Loo
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateReturnReasonModal
