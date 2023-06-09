import Button from "../../../../components/fundamentals/button"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

export const PaymentActionables = ({
  order,
  capturePayment,
  showRefundMenu,
}) => {
  const notification = useNotification()
  const isSystemPayment = order?.payments?.some(
    (p) => p.provider_id === "system"
  )

  const { payment_status } = order!

  // Default label and action
  let label = "Kinnita makse"
  let action = () => {
    capturePayment.mutate(void {}, {
      onSuccess: () =>
        notification("Õnnestus", "Makse on edukalt kinni võetud", "success"),
      onError: (err) => notification("Viga", getErrorMessage(err), "error"),
    })
  }
  const loading = capturePayment.isLoading

  let shouldShowNotice = false
  // If payment is a system payment, we want to show a notice
  if (payment_status === "awaiting" && isSystemPayment) {
    shouldShowNotice = true
  }

  if (payment_status === "requires_action" && isSystemPayment) {
    shouldShowNotice = true
  }

  switch (true) {
    case payment_status === "captured" ||
      payment_status === "partially_refunded": {
      label = "Tagasimakse"
      action = () => showRefundMenu()
      break
    }

    case shouldShowNotice: {
      action = () =>
        console.log(
          "TODO: Kuva hoiatus, mis näitab, et võtate süsteemimakse"
        )
      break
    }

    case payment_status === "requires_action": {
      return null
    }
    default:
      break
  }

  return (
    <Button
      variant="secondary"
      size="small"
      onClick={action}
      loading={loading}
      className="min-w-[130px]"
    >
      {label}
    </Button>
  )
}
