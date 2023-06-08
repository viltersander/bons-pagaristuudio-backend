import { useNavigate } from "react-router-dom";
import TableViewHeader from "../../components/organisms/custom-table-header";

type CustomersPageTableHeaderProps = {
  activeView: "customers" | "groups";
};

const CustomersPageTableHeader: React.FC<CustomersPageTableHeaderProps> = ({
  activeView,
}) => {
  const navigate = useNavigate();

  const handleSetActiveView = (view: "kliendid" | "rühmad") => {
    if (view === "kliendid") {
      navigate("/a/customers");
    } else if (view === "rühmad") {
      navigate("/a/customers/groups");
    }
  };

  const translateViewName = (view: "customers" | "groups") => {
    if (view === "customers") {
      return "kliendid";
    } else if (view === "groups") {
      return "rühmad";
    }
    return view;
  };

  const translatedViews = ["kliendid", "rühmad"].map(translateViewName);

  return (
    <TableViewHeader
      setActiveView={handleSetActiveView}
      views={translatedViews}
      activeView={translateViewName(activeView)}
    />
  );
};

export default CustomersPageTableHeader;
