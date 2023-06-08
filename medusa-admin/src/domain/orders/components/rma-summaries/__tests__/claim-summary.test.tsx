import { Order, ShippingOption } from "@medusajs/medusa"
import { renderHook, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { fixtures } from "../../../../../../test/fixtures"
import { renderWithProviders } from "../../../../../../test/utils/render-with-providers"
import { CreateClaimFormType } from "../../../details/claim/register-claim-menu"
import { ClaimSummary } from "../claim-summary"

describe("ClaimSummary", () => {
  let order: Order
  let so: ShippingOption

  beforeEach(() => {
    order = fixtures.get("order") as unknown as Order
    so = fixtures.get("shipping_option") as unknown as ShippingOption

    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: {
          return_items: {
            items: fixtures.get("order").items.map((item) => ({
              item_id: item.id,
              quantity: item.quantity,
              return: true,
              refundable: 90000,
              total: 90000,
              original_quantity: item.quantity,
            })),
          },
          additional_items: {
            items: fixtures.list("line_item", 5).map((item) => ({
              item_id: item.id,
              quantity: item.quantity,
              price: 10000,
            })),
          },
          replacement_shipping: {
            option: {
              label: so.name,
              value: {
                id: so.id,
                taxRate: 0,
              },
            },
          },
          return_shipping: {
            option: {
              label: so.name,
              value: {
                id: so.id,
                taxRate: 0,
              },
            },
          },
          claim_type: {
            type: "replace",
          },
        },
      })
    )

    renderWithProviders(<ClaimSummary order={order} form={result.current} />)
  })

  it("peaks pakkuma nii tagastamise kui ka asendussaadetise võimalust", async () => {
    expect(screen.getAllByText(so.name)).toHaveLength(2)

    expect(screen.getByText("Tagastav saatmine")).toBeInTheDocument()
    expect(screen.getByText("Asenduse saatmine")).toBeInTheDocument()
    expect(screen.getAllByText("Tasuta")).toHaveLength(2)
  })
})
