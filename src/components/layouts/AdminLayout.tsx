import { useEffect, type PropsWithChildren } from 'react'
import AdminSidebar from '../sidebars/AdminSidebar'
import { Separator } from '../ui/separator'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const AdminLayout = ({ children }: PropsWithChildren) => {
  const { data: userSession } = useSession()
  const { replace } = useRouter()
  useEffect(() => {
    if (userSession && !userSession?.user?.isAdmin) {
      void replace('/', undefined, { shallow: true })
    }
  })

  return userSession?.user.isAdmin ? (
    <div className="min-full-height-minus-top-bar flex">
      <AdminSidebar className="basis-[350px]" />
      <Separator orientation="vertical" />
      <div className="grow">{children}</div>
    </div>
  ) : null
}

export default AdminLayout
