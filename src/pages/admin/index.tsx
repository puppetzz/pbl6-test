import AdminLayout from '@/components/layouts/AdminLayout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { type ReactElement } from 'react'

const AdminPage = () => {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      void router.replace('/')
    }
  })
  return (
    <div className="flex-center box-border h-full w-full">
      <h1 className="text-4xl">Admin Page</h1>
    </div>
  )
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default AdminPage
