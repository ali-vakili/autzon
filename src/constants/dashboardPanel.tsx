import { FiGrid, FiList, FiPlus, FiEdit, FiCircle, FiAlertCircle, FiFile } from "react-icons/fi"


const dashboardPanel = [
  {
    id: 1,
    title: "Dashboard",
    icon: <FiGrid size={16} className="me-1.5"/>,
    href: "/dashboard"
  }
]

const dashboardPanelAutoGallery = (hasAutoGallery: boolean) => {
  const dashboardPaneAutoGalleryItems = [
    {
      id: 2,
      label: "Auto Gallery",
      children: [
        {
          id: 2.1,
          title: "Gallery",
          href: "gallery",
          icon: <FiCircle size={16} className="me-1.5"/>,
          show: hasAutoGallery
        },
        {
          id: 2.2,
          title: "Create Gallery",
          href: "gallery/create",
          icon: <FiPlus size={16} className="me-1.5"/>,
          show: !hasAutoGallery,
          alert: !hasAutoGallery,
          alertIcon: <FiAlertCircle size={16}/>
        },
        {
          id: 2.3,
          title: "Edit Gallery",
          href: "gallery/edit",
          icon: <FiEdit size={16} className="me-1.5"/>,
          show: hasAutoGallery
        },
      ]
    }
  ]

  return dashboardPaneAutoGalleryItems
}


const dashboardPanelCarsItems = [
  {
    id: 3,
    label: "Car",
    children: [
      {
        id: 3.1,
        title: "All Cars",
        href: "cars",
        icon: <FiList size={16} className="me-1.5"/>,
      },
      {
        id: 3.2,
        title: "Add Sale Car",
        href: "cars/sale/create",
        icon: <FiPlus size={16} className="me-1.5"/>,
      },
      {
        id: 3.3,
        title: "Add Rental Car",
        href: "cars/rental/create",
        icon: <FiPlus size={16} className="me-1.5"/>,
      }
    ]
  }
]

const dashboardPanelRequestItems = [
  {
    id: 4,
    label: "Request",
    children: [
      {
        id: 4.1,
        title: "Rent Car",
        href: "request/rent-car",
        icon: <FiFile size={16} className="me-1.5"/>,
      },
    ]
  }
]

export { dashboardPanelAutoGallery, dashboardPanelCarsItems, dashboardPanel, dashboardPanelRequestItems }