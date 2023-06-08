import clsx from "clsx";
import { useEffect, useState } from "react";
import FilterDropdownContainer from "../../../components/molecules/filter-dropdown/container";
import FilterDropdownItem from "../../../components/molecules/filter-dropdown/item";
import SaveFilterItem from "../../../components/molecules/filter-dropdown/save-field";
import TabFilter from "../../../components/molecules/filter-tab";
import PlusIcon from "../../fundamentals/icons/plus-icon";

const statusFilters = [
  "completed",
  "pending",
  "canceled",
  "archived",
  "requires_action",
];
const paymentFilters = [
  "awaiting",
  "captured",
  "refunded",
  "canceled",
  "partially_refunded",
  "requires_action",
  "not_paid",
];
const fulfillmentFilters = [
  "fulfilled",
  "not_fulfilled",
  "partially_fulfilled",
  "returned",
  "partially_returned",
  "shipped",
  "partially_shipped",
  "requires_action",
  "canceled",
];

const dateFilters = [
  "on viimases",
  "on vanem kui",
  "on pärast",
  "on enne",
  "on võrdne",
];

const OrderFilters = ({
  tabs,
  activeTab,
  onTabClick,
  onSaveTab,
  onRemoveTab,
  filters,
  submitFilters,
  clearFilters,
}) => {
  const [tempState, setTempState] = useState(filters);
  const [name, setName] = useState("");

  const handleRemoveTab = (val) => {
    if (onRemoveTab) {
      onRemoveTab(val);
    }
  };

  const handleSaveTab = () => {
    if (onSaveTab) {
      onSaveTab(name, tempState);
    }
  };

  const handleTabClick = (tabName) => {
    if (onTabClick) {
      onTabClick(tabName);
    }
  };

  useEffect(() => {
    setTempState(filters);
  }, [filters]);

  const onSubmit = () => {
    submitFilters(tempState);
  };

  const onClear = () => {
    clearFilters();
  };

  const setSingleFilter = (filterKey, filterVal) => {
    setTempState((prevState) => ({
      ...prevState,
      [filterKey]: filterVal,
    }));
  };

  const numberOfFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value?.open) {
        acc = acc + 1;
      }
      return acc;
    },
    0
  );

  const translateFilter = (filter) => {
    switch (filter) {
      case "completed":
        return "täidetud";
      case "pending":
        return "ootel";
      case "canceled":
        return "tühistatud";
      case "archived":
        return "arhiveeritud";
      case "requires_action":
        return "nõuab tegutsemist";
      case "awaiting":
        return "ootel";
      case "captured":
        return "makstud";
      case "refunded":
        return "tagastatud";
      case "partially_refunded":
        return "osaliselt tagastatud";
      case "not_paid":
        return "maksmata";
      case "not_fulfilled":
        return "täitmata";
      case "partially_fulfilled":
        return "osaliselt täidetud";
      case "returned":
        return "tagastatud";
      case "partially_returned":
        return "osaliselt tagastatud";
      case "shipped":
        return "saadetud";
      case "partially_shipped":
        return "osaliselt saadetud";
      case "canceled":
        return "tühistatud";
      case "on viimases":
        return "on viimases";
      case "on vanem kui":
        return "on vanem kui";
      case "on pärast":
        return "on pärast";
      case "on enne":
        return "on enne";
      case "on võrdne":
        return "on võrdne";
      default:
        return filter;
    }
  };

  return (
    <div className="flex space-x-1">
      <FilterDropdownContainer
        submitFilters={onSubmit}
        clearFilters={onClear}
        triggerElement={
          <button
            className={clsx(
              "rounded-rounded focus-visible:shadow-input focus-visible:border-violet-60 flex items-center space-x-1 focus-visible:outline-none"
            )}
          >
            <div className="rounded-rounded bg-grey-5 border-grey-20 inter-small-semibold flex h-6 items-center border px-2">
              Filtrid
              <div className="text-grey-40 ml-1 flex items-center rounded">
                <span className="text-violet-60 inter-small-semibold">
                  {numberOfFilters ? numberOfFilters : "0"}
                </span>
              </div>
            </div>
            <div className="rounded-rounded bg-grey-5 border-grey-20 inter-small-semibold flex items-center border p-1">
              <PlusIcon size={14} />
            </div>
          </button>
        }
      >
        <FilterDropdownItem
          filterTitle="Olek"
          options={statusFilters.map((filter) => ({
            value: filter,
            label: translateFilter(filter),
          }))}
          filters={tempState.status.filter}
          open={tempState.status.open}
          setFilter={(val) => setSingleFilter("status", val)}
        />
        <FilterDropdownItem
          filterTitle="Makse olek"
          options={paymentFilters.map((filter) => ({
            value: filter,
            label: translateFilter(filter),
          }))}
          filters={tempState.payment.filter}
          open={tempState.payment.open}
          setFilter={(val) => setSingleFilter("payment", val)}
        />
        <FilterDropdownItem
          filterTitle="Täitmise olek"
          options={fulfillmentFilters.map((filter) => ({
            value: filter,
            label: translateFilter(filter),
          }))}
          filters={tempState.fulfillment.filter}
          open={tempState.fulfillment.open}
          setFilter={(val) => setSingleFilter("fulfillment", val)}
        />
        <FilterDropdownItem
          filterTitle="Kuupäev"
          options={dateFilters}
          filters={tempState.date.filter}
          open={tempState.date.open}
          setFilter={(val) => setSingleFilter("date", val)}
        />
        <SaveFilterItem
          saveFilter={handleSaveTab}
          name={name}
          setName={setName}
        />
      </FilterDropdownContainer>
      {tabs &&
        tabs.map((t) => (
          <TabFilter
            key={t.value}
            onClick={() => handleTabClick(t.value)}
            label={t.label}
            isActive={activeTab === t.value}
            removable={!!t.removable}
            onRemove={() => handleRemoveTab(t.value)}
          />
        ))}
    </div>
  );
};

export default OrderFilters;
