import { Route, Routes, useNavigate } from "react-router-dom"
import Spacer from "../../components/atoms/spacer"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import PricingDetails from "./details"
import New from "./new"
import PricingTable from "./pricing-table"

const PricingIndex = () => {
  const navigate = useNavigate()

  const actionables = [
    {
      label: "Lisa hinnakiri",
      onClick: () => navigate(`/a/pricing/new`),
      icon: <PlusIcon size={20} />,
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          actionables={actionables}
          customHeader={<TableViewHeader views={["Hinnakirjad"]} />}
          className="h-fit"
        >
          <PricingTable />
        </BodyCard>
        <Spacer />
      </div>
    </div>
  )
}

const Pricing = () => {
  return (
    <Routes>
      <Route index element={<PricingIndex />} />
      <Route path="/new" element={<New />} />
      <Route path="/:id" element={<PricingDetails />} />
    </Routes>
  )
}

export default Pricing
