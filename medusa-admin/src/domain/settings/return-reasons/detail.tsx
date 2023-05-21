import { ReturnReason } from "@medusajs/medusa"
import {
  useAdminDeleteReturnReason,
  useAdminUpdateReturnReason,
} from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import DuplicateIcon from "../../../components/fundamentals/icons/duplicate-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Input from "../../../components/molecules/input"
import BodyCard from "../../../components/organisms/body-card"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../utils/error-messages"
import CreateReturnReasonModal from "./create-reason-modal"

type ReturnReasonDetailsProps = {
  reason: ReturnReason
}

type ReturnReasonDetailsFormData = {
  label: string
  description: string | null
}

const ReturnReasonDetail = ({ reason }: ReturnReasonDetailsProps) => {
  const {
    state: showDuplicateModal,
    open: handleOpenDuplicateModal,
    close: handleCloseDuplicateModal,
  } = useToggleState()
  const {
    state: showDanger,
    open: handleOpenPrompt,
    close: handleClosePrompt,
  } = useToggleState()
  const { register, reset, handleSubmit } =
    useForm<ReturnReasonDetailsFormData>()
  const notification = useNotification()
  const { mutate: deleteRR } = useAdminDeleteReturnReason(reason?.id)
  const { mutate: update } = useAdminUpdateReturnReason(reason?.id)

  const handleDeletion = async () => {
    deleteRR(undefined)
  }

  const onSave = (data: ReturnReasonDetailsFormData) => {
    update(
      {
        label: data.label,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          notification(
            "Õnnestus",
            "Tagastamise põhjuse värskendamine õnnestus",
            "success"
          )
        },
        onError: (error) => {
          notification("Viga", getErrorMessage(error), "error")
        },
      }
    )
  }

  const handleCancel = () => {
    reset({
      label: reason.label,
      description: reason.description,
    })
  }

  useEffect(() => {
    if (reason) {
      reset({
        label: reason.label,
        description: reason.description,
      })
    }
  }, [reason])

  return (
    <>
      <BodyCard
        actionables={[
          {
            label: "Dubleeritud põhjus",
            icon: <DuplicateIcon size={20} />,
            onClick: () => handleOpenDuplicateModal(),
          },
          {
            label: "Kustuta põhjus",
            variant: "danger",
            icon: <TrashIcon size={20} />,
            onClick: () => handleOpenPrompt(),
          },
        ]}
        events={[
          {
            label: "Salvesta",
            onClick: handleSubmit(onSave),
          },
          {
            label: "Tühista",
            onClick: handleCancel,
          },
        ]}
        title="Üksikasjad"
        subtitle={reason?.value}
      >
        <form onSubmit={handleSubmit(onSave)}>
          <Input {...register("label")} label="Label" />
          <Input
            {...register("description")}
            label="Kirjeldus"
            className="mt-base"
            placeholder="Klient sai vale suuruse"
          />
        </form>
      </BodyCard>
      {showDuplicateModal && (
        <CreateReturnReasonModal
          initialReason={reason}
          handleClose={handleCloseDuplicateModal}
        />
      )}
      {showDanger && (
        <DeletePrompt
          heading="Kustuta tagastamise põhjus"
          text="Kas olete kindel, et soovite selle tagastamise põhjuse kustutada?"
          handleClose={handleClosePrompt}
          onDelete={handleDeletion}
        />
      )}
    </>
  )
}

export default ReturnReasonDetail
