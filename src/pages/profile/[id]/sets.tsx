import ProfileLayout from '@/components/layouts/ProfileLayout'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import { useMemo, type ReactElement } from 'react'
import dayjs from 'dayjs'
import { TimeStampDivider } from '@/components/common/TimeStampDivider'
import { groupBy } from 'lodash'
import { Badge } from '@/components/ui/badge'

const Sets = () => {
  const router = useRouter()
  const { id } = router.query
  const { data } = api.study.getAllStudySetsByUserId.useQuery({
    userId: String(id)
  })

  const extractedData = useMemo(
    () =>
      data
        ? groupBy(data, (item) => dayjs(item.createdAt).format('MMMM YYYY'))
        : [],
    [data]
  )

  return (
    <div className="space-y-10">
      {Object.entries(extractedData).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <TimeStampDivider
            label={`in ${key}`}
            classes={{
              label:
                'uppercase font-medium text-md text-muted-foreground tracking-widest'
            }}
          />
          <div className="grid grid-cols-1 gap-2">
            {value.map((item) => (
              <div
                key={item.id}
                className="after-bottom flex cursor-pointer flex-col justify-between overflow-hidden rounded-md border p-4 shadow-md after:h-[3px] after:bg-primary after:opacity-0 hover:after:opacity-100"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold">{item.title}</div>
                    <span className="divider-vertical h-4 bg-muted-foreground/40" />
                    <div className="flex justify-between">
                      <div className="text-sm">
                        {item.isPublic ? (
                          <Badge>Public</Badge>
                        ) : (
                          <Badge variant="outline">Private</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

Sets.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>
}

export default Sets
