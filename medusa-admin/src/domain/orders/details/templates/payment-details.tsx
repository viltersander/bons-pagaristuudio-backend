import { DisplayTotal } from "./display-total"

export const PaymentDetails = ({
  currency,
  swapAmount,
  manualRefund,
  swapRefund,
  returnRefund,
  paidTotal,
  refundedTotal,
}) => {
  if (swapAmount + manualRefund + swapRefund + returnRefund === 0) {
    return null
  }

  return (
    <>
      {!!swapAmount && (
        <DisplayTotal
          currency={currency}
          totalAmount={swapAmount}
          totalTitle={"Vahetustegusid kokku"}
        />
      )}
      {!!swapRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={returnRefund}
          totalTitle={"Vahetuste eest raha tagasi"}
        />
      )}
      {!!returnRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={returnRefund}
          totalTitle={"Tagastamise eest raha tagasi"}
        />
      )}
      {!!manualRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={manualRefund}
          totalTitle={"Tagastatud käsitsi"}
        />
      )}
      <DisplayTotal
        variant={"bold"}
        currency={currency}
        totalAmount={paidTotal - refundedTotal}
        totalTitle={"Netosumma"}
      />
    </>
  )
}
