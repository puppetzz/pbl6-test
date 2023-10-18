import { type PropsWithChildren } from 'react'
import AdminSidebar from '../sidebars/AdminSidebar'
import { Separator } from '../ui/separator'

const AdminLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="full-height-minus-top-bar flex">
      <AdminSidebar className="basis-[250px]" />
      <Separator orientation="vertical" />
      <div className="grow">{children}</div>
    </div>
  )
}

export default AdminLayout
