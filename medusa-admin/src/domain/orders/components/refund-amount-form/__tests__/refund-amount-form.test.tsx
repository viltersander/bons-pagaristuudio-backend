import { Order } from "@medusajs/medusa"
import { fireEvent, renderHook, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm, UseFormReturn } from "react-hook-form"
import RefundAmountForm from ".."
import { fixtures } from "../../../../../../test/fixtures"
import { renderWithProviders } from "../../../../../../test/utils/render-with-providers"
import { nestedForm } from "../../../../../utils/nested-form"
import { CreateClaimFormType } from "../../../details/claim/register-claim-menu"
import { getDefaultClaimValues } from "../../../details/utils/get-default-values"

describe("RefundAmountForm refund claim", () => {
  let form: UseFormReturn<CreateClaimFormType, any>

  beforeEach(() => {
    const order = fixtures.get("order") as unknown as Order

    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: getDefaultClaimValues(order),
      })
    )

    form = result.current

    renderWithProviders(
      <RefundAmountForm
        form={nestedForm(form, "refund_amount")}
        order={order}
      />
    )
  })

  it("peaks õigesti renderdama", async () => {
    // Initial value should be 0
    expect(screen.getByText("€0.00")).toBeInTheDocument()
  })

  it("peaks sisendi muutmisel väärtust värskendama", async () => {
    const button = screen.getByLabelText("Muuda tagasimakse summat")

    const user = userEvent.setup()

    await user.click(button)

    const input = screen.getByPlaceholderText("-")

    fireEvent.change(input, { target: { value: "100" } })

    await waitFor(() => {
      const {
        refund_amount: { amount },
      } = form.getValues()

      // We enter 100, but the value should be 10000 since we are transforming from dollars to cents
      expect(amount).toEqual(10000)
    })
  })
})
