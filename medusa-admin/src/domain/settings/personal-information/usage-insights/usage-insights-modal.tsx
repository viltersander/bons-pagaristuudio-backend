import { AnalyticsConfig } from "@medusajs/medusa"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import AnalyticsConfigForm, {
  AnalyticsConfigFormType,
} from "../../../../components/organisms/analytics-config-form"
import useNotification from "../../../../hooks/use-notification"
import { useAdminUpdateAnalyticsConfig } from "../../../../services/analytics"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"

type Props = {
  config: AnalyticsConfig
  open: boolean
  onClose: () => void
}

const UsageInsightsModal = ({ config, open, onClose }: Props) => {
  const { mutate, isLoading: isSubmitting } = useAdminUpdateAnalyticsConfig()

  const form = useForm<AnalyticsConfigFormType>({
    defaultValues: {
      opt_out: config.opt_out,
      anonymize: config.anonymize,
    },
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    reset({
      opt_out: config.opt_out,
      anonymize: config.anonymize,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, config])

  const notification = useNotification()

  const onSubmit = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        notification(
          "Õnnestus",
          "Teie teabe värskendamine õnnestus",
          "success"
        )
        onClose()
      },
      onError: (err) => {
        notification("Viga", getErrorMessage(err), "error")
      },
    })
  })

  return (
    <Modal handleClose={onClose} open={open} isLargeModal={true}>
      <Modal.Header handleClose={onClose}>
        <h1 className="inter-xlarge-semibold">Muuda eelistusi</h1>
      </Modal.Header>
      <Modal.Body>
        <Modal.Content>
          <AnalyticsConfigForm form={nestedForm(form)} />
        </Modal.Content>
        <Modal.Footer className="border-grey-20 pt-base border-t">
          <div className="gap-x-xsmall flex w-full items-center justify-end">
            <Button variant="secondary" size="small" onClick={onClose}>
              Tühista
            </Button>
            <Button
              variant="primary"
              size="small"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              Esita ja sulge
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default UsageInsightsModal
