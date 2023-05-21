import { Product } from "@medusajs/medusa"
import useToggleState from "../../../hooks/use-toggle-state"
import EditIcon from "../../fundamentals/icons/edit-icon"
import { ActionType } from "../../molecules/actionables"
import Section from "../section"
import AttributeModal from "./attribute-modal"

type Props = {
  product: Product
}

const ProductAttributesSection = ({ product }: Props) => {
  const { state, toggle, close } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Muuda atribuute",
      onClick: toggle,
      icon: <EditIcon size={20} />,
    },
  ]

  return (
    <>
      <Section title="Atribuudid" actions={actions} forceDropdown>
        <div className="gap-y-xsmall mb-large mt-base flex flex-col">
          <h2 className="inter-base-semibold">Mõõtmed</h2>
          <div className="gap-y-xsmall flex flex-col">
            <Attribute attribute="Kõrgus" value={product.height} />
            <Attribute attribute="Laius" value={product.width} />
            <Attribute attribute="Pikkus" value={product.length} />
            <Attribute attribute="Kaal" value={product.weight} />
          </div>
        </div>
        <div className="gap-y-xsmall flex flex-col">
          <h2 className="inter-base-semibold">Toll</h2>
          <div className="gap-y-xsmall flex flex-col">
            <Attribute attribute="Toote MID kood" value={product.mid_code} />
            <Attribute attribute="Toote HS kood" value={product.hs_code} />
            <Attribute
              attribute="Päritoluriik"
              value={product.origin_country}
            />
          </div>
        </div>
      </Section>

      <AttributeModal onClose={close} open={state} product={product} />
    </>
  )
}

type AttributeProps = {
  attribute: string
  value: string | number | null
}

const Attribute = ({ attribute, value }: AttributeProps) => {
  return (
    <div className="inter-base-regular text-grey-50 flex w-full items-center justify-between">
      <p>{attribute}</p>
      <p>{value || "–"}</p>
    </div>
  )
}

export default ProductAttributesSection
