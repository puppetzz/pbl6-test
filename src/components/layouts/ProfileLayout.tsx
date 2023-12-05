import { useSession } from 'next-auth/react'
import { useMemo, type PropsWithChildren } from 'react'
import { RouterTabs } from '../common/RouterTabs'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const ProfileLayout = ({ children }: PropsWithChildren) => {
  const { data: userSession } = useSession()

  const routerTabItems = useMemo(() => {
    const id = userSession?.user?.id
    return [
      {
        label: 'Study sets',
        value: 'sets',
        href: `/profile/${id}/sets`
      },
      {
        label: 'Quizzes',
        value: 'quizzes',
        href: `/profile/${id}/quizzes`
      },
      {
        label: 'Settings',
        value: 'settings',
        href: `/profile/${id}/settings`
      }
    ]
  }, [userSession])

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="flex w-2/3 items-end gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={userSession?.user.image || ''} />
          <AvatarFallback>{userSession?.user.name}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-2xl font-bold">{userSession?.user.email}</div>
          <div className="font-semibold text-muted-foreground">
            {userSession?.user.name}
          </div>
        </div>
      </div>
      <RouterTabs
        items={routerTabItems}
        variant={'underline'}
        className="w-2/3"
        classes={{
          list: 'w-full justify-start gap-2',
          trigger: 'text-md font-semibold'
        }}
      />
      <div className="w-2/3">{children}</div>
    </div>
  )
}

export default ProfileLayout
