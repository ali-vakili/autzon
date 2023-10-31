import {
  FiUser,
  FiBookmark,
  FiGrid,
  FiAlertCircle
} from "react-icons/fi"
import { AGENT } from "./roles"

type userNavMenuItemTypes = {
  id: number,
  title: string,
  icon: JSX.Element,
  href: string,
  role?: string,
  alert?: boolean,
  alertIcon?: JSX.Element,
  disabled?: boolean
}[]

const userNavDropDownMenuItems = (is_profile_complete: boolean) => {
  const alertIcon = <FiAlertCircle size={16}/>

  const userNavMenuItems: userNavMenuItemTypes = [
    {
      id: 1,
      title: "Account",
      icon: <FiUser size={16} className="me-3"/>,
      href: "/account",
      alert: !is_profile_complete,
      alertIcon
    },
    {
      id: 2,
      title: "Dashboard",
      icon: <FiGrid size={16} className="me-3"/>,
      href: "dashboard",
      role: AGENT,
      disabled: !is_profile_complete
    },
    {
      id: 3,
      title: "Saves",
      icon: <FiBookmark size={16} className="me-3"/>,
      href: "#",
      disabled: !is_profile_complete
    }
  ]

  return userNavMenuItems;
}

export default userNavDropDownMenuItems;