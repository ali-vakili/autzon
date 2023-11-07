import { FiGrid, FiList, FiPlus, FiEdit, FiCircle } from "react-icons/fi"


type dashboardPanelItem = {
  id: number;
  title: string;
  href: string;
  icon?: JSX.Element;
  alert?: boolean;
  alertIcon?: JSX.Element;
  disabled?: boolean;
};

type dashboardPanelGroupItem = {
  label: string;
  children: dashboardPanelItem[];
};

type dashboardPanelItemsType = dashboardPanelItem | dashboardPanelGroupItem;

const dashboardPanel = () => {
  const dashboardPanelItems = [
    {
      id: 1,
      title: "Dashboard",
      icon: <FiGrid size={16} className={"me-1.5"}/>,
      href: "/dashboard"
    },
    {
      id: 2,
      label: "Auto Gallery",
      children: [
        {
          id: 2.1,
          title: "Gallery",
          href: "gallery",
          icon: <FiCircle size={16} className={"me-1.5"}/>,
        },
        {
          id: 2.2,
          title: "Create Gallery",
          href: "gallery/create",
          icon: <FiPlus size={16} className={"me-1.5"}/>,
        },
        {
          id: 2.3,
          title: "Edit Gallery",
          href: "gallery/edit",
          icon: <FiEdit size={16} className={"me-1.5"}/>,
        },
      ]
    },
    {
      id: 3,
      label: "Car",
      children: [
        {
          id: 3.1,
          title: "All Cars",
          href: "cars",
          icon: <FiList size={16} className={"me-1.5"}/>,
        },
        {
          id: 3.2,
          title: "Add Sale Car",
          href: "cars/sale/create",
          icon: <FiPlus size={16} className={"me-1.5"}/>,
        },
        {
          id: 3.3,
          title: "Add Rental Car",
          href: "cars/rental/create",
          icon: <FiPlus size={16} className={"me-1.5"}/>,
        }
      ]
    },
  ]

  return dashboardPanelItems
}

export default dashboardPanel