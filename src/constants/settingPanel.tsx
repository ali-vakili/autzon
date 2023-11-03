import { FiAlertCircle } from "react-icons/fi"


type settingPanelItemsTypes = {
  id: number,
  title: string,
  href: string,
  role?: string,
  alert?: boolean,
  alertIcon?: JSX.Element,
  disabled?: boolean
}[]

const settingPanel = (is_profile_complete: boolean|undefined = true) => {
  const settingPanelItems: settingPanelItemsTypes = [
    {
      id: 1,
      title: "General",
      href: "/account"
    },
    {
      id: 2,
      title: "Edit Profile",
      href: "/account/profile",
      alert: !is_profile_complete,
      alertIcon: <FiAlertCircle size={16}/>
    },
    {
      id: 3,
      title: "Account Management",
      href: "/account/management",
    }
  ]

  return settingPanelItems
}

export default settingPanel