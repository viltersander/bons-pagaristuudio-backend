import { useAdminReturnReasons } from "medusa-react"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { ReturnReasonDetails } from ".."
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { useLayeredModal } from "../../../../../components/molecules/modal/layered-modal"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import TextArea from "../../../../../components/molecules/textarea"

type Props = {
  reasonDetails: ReturnReasonDetails
  addReasonDetails: (index: number, details: ReturnReasonDetails) => void
  index: number
  isClaim?: boolean
}

const claimReturnReasons = [
  {
    label: "Üksus puudub",
    value: "missing_item",
  },
  {
    label: "Vale üksus",
    value: "wrong_item",
  },
  {
    label: "Tootmise ebaõnnestumine",
    value: "production_failure",
  },
  {
    label: "Muu",
    value: "other",
  },
]

const AddReasonScreen = ({
  reasonDetails,
  index,
  isClaim = false,
  addReasonDetails,
}: Props) => {
  const { return_reasons } = useAdminReturnReasons()
  const returnReasonOptions = useMemo(() => {
    if (isClaim) {
      return claimReturnReasons
    }

    return (
      return_reasons?.map((reason) => ({
        label: reason.label,
        value: reason.id,
      })) || []
    )
  }, [return_reasons, isClaim])

  const {
    control,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ReturnReasonDetails>({
    defaultValues: reasonDetails,
  })

  const { pop } = useLayeredModal()

  const onSubmit = handleSubmit((data) => {
    addReasonDetails(index, data)
    pop()
  })

  return (
    <>
      <Modal.Content>
        <div className="gap-y-base flex flex-col">
          <h2 className="inter-base-semibold">Tagastamise põhjus</h2>
          <Controller
            control={control}
            name="reason"
            render={({ field }) => {
              return (
                <NextSelect
                  label="Põhjus"
                  placeholder="Valige tagastamise põhjus"
                  {...field}
                  options={returnReasonOptions}
                  isClearable
                />
              )
            }}
          />
          <TextArea
            label="Märge"
            placeholder="Toode sai saatmise ajal kahjustatud"
            {...register("note")}
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full items-center justify-end">
          <Button size="small" variant="secondary" onClick={pop} type="button">
            Tühista
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSubmit}
            disabled={!isDirty}
            type="button"
          >
            Salvesta ja mine tagasi
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export const useAddReasonScreen = () => {
  const { pop, push } = useLayeredModal()

  const pushScreen = (props: Props) => {
    push({
      title: "Select Reason",
      onBack: () => pop(),
      view: <AddReasonScreen {...props} />,
    })
  }

  return { pushScreen }
}
