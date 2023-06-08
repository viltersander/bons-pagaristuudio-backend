import { Product } from "@medusajs/medusa"
import { useAdminPriceListProducts } from "medusa-react"
import * as React from "react"
import Accordion from "../../../../components/organisms/accordion"
import { merge } from "../../details/sections/prices-details/utils"
import ProductPrices from "./product-prices"

type PricesSectionProps = {
  isEdit?: boolean
  id?: string
}

const defaultQueryFilters = {
  limit: 50,
  offset: 0,
}

const PricesSection = ({ isEdit = false, id }: PricesSectionProps) => {
  const {
    products = [],
    isInitialLoading,
    isLoading,
  } = useAdminPriceListProducts(id!, defaultQueryFilters, {
    enabled: isEdit,
  })

  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([])
  const mergedProducts = merge(products, selectedProducts)

  return (
    <Accordion.Item
      forceMountContent
      required
      value="prices"
      title="Hinnad"
      description="Saate siia lisada soodustused toodete hindadele"
      tooltip="Määratlege hinnakirja hindade soodustused"
    >
      <ProductPrices
        products={mergedProducts}
        isLoading={isEdit ? isLoading : isInitialLoading}
        setProducts={setSelectedProducts}
        onFileChosen={console.log}
      />
    </Accordion.Item>
  )
}

export default PricesSection
