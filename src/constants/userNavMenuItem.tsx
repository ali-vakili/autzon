import {
  FiUser,
  FiBookmark,
  FiGrid,
  FiAlertCircle
} from "react-icons/fi"
import { AGENT } from "./roles"

type userNavMenuItemTypes = {
  title: string,
  icon: JSX.Element,
  href: string,
  role?: string,
  alert?: boolean,
  alertIcon?: JSX.Element,
  disabled?: boolean
}[]

const userNavDropDownMenuItems = (is_profile_complete: boolean) => {

  const userNavMenuItems: userNavMenuItemTypes = [
    {
      title: "Profile",
      icon: <FiUser size={16} className="me-3"/>,
      href: "#",
      alert: !is_profile_complete,
      alertIcon: <FiAlertCircle size={16}/>
    },
    {
      title: "Dashboard",
      icon: <FiGrid size={16} className="me-3"/>,
      href: "dashboard",
      role: AGENT,
      disabled: !is_profile_complete
    },
    {
      title: "Saves",
      icon: <FiBookmark size={16} className="me-3"/>,
      href: "#",
      disabled: !is_profile_complete
    }
  ]

  return userNavMenuItems;
}

export default userNavDropDownMenuItems;