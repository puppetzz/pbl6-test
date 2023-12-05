import StatusAlert from '@/components/common/StatusAlert'
import { SortableList } from '@/components/dnd-kit/SortableList'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { CoursePageContext } from '@/pages/admin/course'
import { type Questions, type TUpdateCourseInput } from '@/types'
import { levelTransformerToNumber } from '@/utils'
import { api } from '@/utils/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import {
  useContext,
  useState,
  type PropsWithChildren,
  useMemo,
  useEffect
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  level: z.string().nonempty('Level is required'),
  type: z.string()
})

type EditCourseFormProps = {
  className?: string
  courseId: string
  defaultValues?: z.infer<typeof formSchema>
  defaultQuestions: Questions
}

const EditCourseForm = ({
  children,
  className,
  courseId,
  defaultValues,
  defaultQuestions
}: PropsWithChildren<EditCourseFormProps>) => {
  const { refetch } = useContext(CoursePageContext)
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema)
  })

  const {
    data,
    mutate: getQuestions,
    status
  } = api.admin.getQuestions.useMutation()
  const { mutate: updateCourse } = api.admin.updateCourse.useMutation({
    onSuccess: () => {
      setIsOpen(false)
      setPickedQuestions([])
      refetch?.()
      form.reset()
    }
  })

  const [isOpen, setIsOpen] = useState(false)
  const [pickedQuestions, setPickedQuestions] =
    useState<Questions>(defaultQuestions)

  const handleOnSubmit = (values: z.infer<typeof formSchema>) => {
    const newCourse: TUpdateCourseInput = {
      ...values,
      id: courseId,
      level: levelTransformerToNumber(values.level),
      questionIds: pickedQuestions.map((item) => ({
        id: item.id || '',
        templateQuestionId: item.templateQuestionId || ''
      }))
    }
    updateCourse(newCourse)
    setIsOpen(false)
  }

  const renderQuestions = () => {
    if (status === 'loading') {
      return <div>Loading...</div>
    }

    if (status === 'error' || status === 'idle') {
      return <div>No results</div>
    }

    if (status === 'success') {
      return !!data.length ? (
        data?.map((question) => {
          const isPicked = pickedQuestions
            .map((q) => {
              return q.templateQuestionId || q.id
            })
            .includes(question.id)

          return (
            <div
              key={question.id}
              className={cn(
                'group flex cursor-pointer justify-between p-2 transition-all hover:bg-card2',
                {
                  'bg-card2': isPicked
                }
              )}
              onClick={() => {
                if (isPicked) {
                  return setPickedQuestions((prev) => {
                    return prev.filter((item) => {
                      if (!!item.templateQuestionId) {
                        return item.templateQuestionId !== question.id
                      }
                      return item.id !== question.id
                    })
                  })
                }
                setPickedQuestions((prev) => {
                  if (prev.find((item) => item.id === question.id)) {
                    return prev
                  }
                  return [...prev, question]
                })
              }}
            >
              <span>{question.content}</span>
              {isPicked ? (
                <ChevronsLeft className="animate-bounce-to-left opacity-0 transition-all group-hover:opacity-100" />
              ) : (
                <ChevronsRight className="animate-bounce-to-right opacity-0 transition-all group-hover:opacity-100" />
              )}
            </div>
          )
        })
      ) : (
        <div>No results</div>
      )
    }
  }

  const isDirty = useMemo(() => {
    return (
      form.formState.isDirty ||
      pickedQuestions.length !== defaultQuestions.length ||
      pickedQuestions.some(
        (item, index) => item.id !== defaultQuestions?.[index]?.id
      )
    )
  }, [pickedQuestions, defaultQuestions, form.formState.isDirty])

  useEffect(() => {
    getQuestions({
      filter: {
        level: levelTransformerToNumber(form.getValues('level'))
      }
    })
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className={className} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="h-[70rem] max-h-[90vh] max-w-[70vw]">
        <div className="flex h-full gap-4 overflow-hidden">
          <div className="flex h-full basis-2/5 flex-col overflow-y-auto">
            <span className="w-full text-center text-2xl font-bold">
              Properties
            </span>
            <Form {...form}>
              <form
                className="flex grow flex-col"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={form.handleSubmit(handleOnSubmit)}
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Course name" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="outline-none">
                            <SelectValue placeholder="Please select course type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pronunciation">
                            Pronunciation
                          </SelectItem>
                          <SelectItem value="Grammar">Grammar</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Question content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Course description"
                          className="max-h-[10rem]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="level"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course level</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setPickedQuestions([])
                          getQuestions({
                            filter: {
                              level: levelTransformerToNumber(value)
                            }
                          })
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="outline-none">
                            <SelectValue placeholder="Please select a level for the course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="hover:no-underline">
                      Pick questions
                    </AccordionTrigger>
                    <AccordionContent className="max-h-[20rem] overflow-auto shadow-lg">
                      {renderQuestions()}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="mt-auto grid grid-cols-2 gap-x-2 gap-y-1">
                  {isDirty && (
                    <StatusAlert
                      status="draft"
                      className="col-span-2 ml-auto"
                      customStatusMessage="Editing"
                    />
                  )}
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault()
                      setPickedQuestions(defaultQuestions)
                      form.reset()
                    }}
                  >
                    Reset
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </div>
          <span className="divider-vertical" />
          <div className="basis-3/5 overflow-y-auto">
            <SortableList
              items={pickedQuestions}
              onChange={setPickedQuestions}
              renderItem={(item) => (
                <SortableList.Item
                  key={item.id}
                  id={item.id}
                  className="items-center"
                >
                  <div>{item.content}</div>
                  <div
                    className="ml-auto cursor-pointer transition-all hover:rotate-90"
                    onClick={() => {
                      setPickedQuestions((prev) => {
                        return prev.filter((question) => {
                          return question.id !== item.id
                        })
                      })
                    }}
                  >
                    <X />
                  </div>
                  <SortableList.DragHandle className="bg-transparent hover:bg-transparent" />
                </SortableList.Item>
              )}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditCourseForm
