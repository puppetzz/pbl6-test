import { cn } from '@/lib/utils'
import {
  BookMarked,
  LayoutDashboard,
  PencilRuler,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const menuItems = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    name: 'Lessons',
    path: '/admin/course',
    icon: <BookMarked className="h-5 w-5" />
  },
  {
    name: 'Questions',
    path: '/admin/question',
    icon: <PencilRuler className="h-5 w-5" />
  },
  {
    name: 'Orders',
    path: '/admin/orders',
    icon: <BookMarked className="h-5 w-5" />
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: <Settings className="h-5 w-5" />
  }
]

type AdminSidebarProps = {
  className?: string
}

const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const router = useRouter()

  return (
    <div className={cn('flex w-full flex-col', className)}>
      {menuItems.map((item) => {
        return (
          <Link href={item.path} key={item.name}>
            <div
              className={cn(
                'flex h-12 w-full cursor-pointer items-center justify-start p-8 hover:bg-card2',
                {
                  'bg-card2': router.pathname === item.path
                }
              )}
            >
              <div className="mr-4 flex h-8 w-8 items-center justify-center">
                {item.icon}
              </div>
              <div className="text-lg font-medium text-gray-500">
                {item.name}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default AdminSidebar
