import React from "react"
import RadioGroup from "../../../../../../components/organisms/radio-group"
import { DiscountConditionOperator } from "../../../../types"

type ConditionOperatorProps = {
  value: "in" | "not_in"
  onChange: (value: DiscountConditionOperator) => void
}

const ConditionOperator: React.FC<ConditionOperatorProps> = ({
  value,
  onChange,
}) => {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onChange}
      className="gap-base mb-4 grid grid-cols-2"
    >
      <RadioGroup.Item
        className="w-full"
        label="Sees"
        value={DiscountConditionOperator.IN}
        description="Kehtib valitud üksustele."
      />
      <RadioGroup.Item
        className="w-full"
        label="Mitte sisse"
        value={DiscountConditionOperator.NOT_IN}
        description="Kehtib kõikidele üksustele peale valitud üksuste."
      />
    </RadioGroup.Root>
  )
}

export default ConditionOperator
