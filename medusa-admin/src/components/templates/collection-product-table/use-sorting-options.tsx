import { useEffect, useState } from "react"
import { FilteringOptionProps } from "../../molecules/table/filtering-option"
import { SimpleProductType } from "./utils"

// TODO: Redo this with server side sorting

const useSortingOptions = (products: SimpleProductType[]) => {
  const [options, setOptions] = useState<FilteringOptionProps[]>([])
  const [sortedProducts, setSortedProducts] =
    useState<SimpleProductType[]>(products)

  const sortByTitle = (a: SimpleProductType, b: SimpleProductType) => {
    if (a.title < b.title) {
      return -1
    }
    if (a.title > b.title) {
      return 1
    }
    return 0
  }

  const sortByNewest = (a: SimpleProductType, b: SimpleProductType) => {
    if (a.created_at < b.created_at) {
      return -1
    }
    if (a.created_at > b.created_at) {
      return 1
    }
    return 0
  }

  const sortByOldest = (a: SimpleProductType, b: SimpleProductType) => {
    if (a.created_at > b.created_at) {
      return -1
    }
    if (a.created_at < b.created_at) {
      return 1
    }
    return 0
  }

  useEffect(() => {
    setOptions([
      {
        title: "Sorteeri",
        options: [
          {
            title: "Kõik",
            onClick: () => {
              setSortedProducts(products)
            },
          },
          {
            title: "Uusim",
            onClick: () => {
              const sorted = products.sort(sortByNewest)
              console.log(sorted)
              setSortedProducts(sorted)
            },
          },
          {
            title: "Vanim",
            onClick: () => {
              const sorted = products.sort(sortByOldest)
              console.log(sorted)
              setSortedProducts(sorted)
            },
          },
          {
            title: "Pealkiri",
            onClick: () => {
              const sorted = products.sort(sortByTitle)
              console.log(sorted)
              setSortedProducts(sorted)
            },
          },
        ],
      },
    ])

    setSortedProducts(products)
  }, [products])

  return [sortedProducts, options]
}

export default useSortingOptions
