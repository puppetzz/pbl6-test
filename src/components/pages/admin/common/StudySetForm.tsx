import { SortableList } from '@/components/dnd-kit/SortableList'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { type TStudySetById } from '@/types/client-types/study-set-route'
import { api } from '@/utils/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { isNil, omit } from 'lodash'
import { ArrowLeftRight, Plus, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  isPublic: z.boolean(),
  cards: z
    .array(
      z.object({
        id: z.string(),
        term: z.string().nonempty(),
        definition: z.string().nonempty(),
        imageURL: z.string().optional().nullable(),
        index: z.number()
      })
    )
    .min(2)
})

type TStudySetFormValues = z.infer<typeof formSchema>

type TStudySetFormProps = {
  defaultValues?: TStudySetById
  isUpdateStatus?: boolean
}

const initialValues: TStudySetFormValues = {
  title: '',
  description: '',
  isPublic: false,
  cards: [
    {
      id: '1',
      term: '',
      definition: '',
      index: 0
    },
    {
      id: '2',
      term: '',
      definition: '',
      index: 1
    }
  ]
}

export const StudySetForm = ({
  defaultValues,
  isUpdateStatus = false
}: TStudySetFormProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { mutate: createStudy, isLoading: createLoading } =
    api.study.createStudySet.useMutation({
      onSuccess: () => {
        void router.push(`/profile/${session?.user.id}/sets`)
      }
    })
  const { mutate: updateStudySet, isLoading: updateLoading } =
    api.study.updateStudySet.useMutation({
      onSuccess: () => {
        void router.push(`/profile/${session?.user.id}/sets`)
      }
    })

  const form = useForm<TStudySetFormValues>({
    defaultValues: (defaultValues as TStudySetFormValues) ?? initialValues,
    resolver: zodResolver(formSchema)
  })

  const { control, handleSubmit, watch, reset } = form

  useEffect(() => {
    reset(defaultValues as TStudySetFormValues)
  }, [defaultValues])

  const { fields, replace, update, append } = useFieldArray({
    control,
    name: 'cards',
    keyName: '_id'
  })

  const watchFieldArray = watch('cards')
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    }
  })

  const handleAddCard = () => {
    append({
      id: `${controlledFields.length + 1}`,
      term: '',
      definition: '',
      index: controlledFields.length
    })
  }

  const handleRemoveCard = (index: number) => {
    const newCards = controlledFields
      .filter((_, i) => i !== index)
      .map((card, i) => ({
        ...card,
        index: i
      }))
    replace(newCards)
  }

  const handleSwapContent = (
    index: number,
    { term, definition }: { term: string; definition: string }
  ) => {
    const fieldData = controlledFields.find((_, i) => i === index)
    update(index, {
      id: fieldData?.id || '',
      index: fieldData?.index || 0,
      imageURL: fieldData?.imageURL || '',
      term: definition,
      definition: term
    })
    reset({
      ...form.getValues(),
      cards: controlledFields.map((card, i) => {
        if (i === index) {
          return {
            ...card,
            term: definition,
            definition: term
          }
        }
        return card
      })
    })
  }

  const onSubmit = (data: TStudySetFormValues) => {
    if (isUpdateStatus) {
      return updateStudySet({
        ...data,
        id: defaultValues?.id || '',
        cards: data.cards.map((card) => {
          return omit(card, 'id')
        })
      })
    }
    createStudy({
      ...data,
      userId: session?.user.id || '',
      isPublic: false,
      cards: data.cards.map((card) => {
        return omit(card, 'id')
      })
    })
  }

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises*/}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">Create a new study set</h2>
          <Button type="submit">{isUpdateStatus ? 'Update' : 'Create'}</Button>
        </div>
        <FormField
          name="title"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className="text-md bg-card font-semibold"
                  placeholder={`Enter a title, like "Vocabulary - Chapter 21: School"`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="description"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-card text-sm font-semibold"
                    placeholder="Add a description..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div>a</div>
        </div>
        <div>
          <SortableList
            items={controlledFields}
            onChange={(value) => {
              const newCards = value.map((card, index) => ({
                ...card,
                index
              }))
              replace(newCards)
            }}
            renderItem={(card) => (
              <SortableList.Item
                key={card.id}
                id={card.id}
                className="flex-col bg-card p-0"
              >
                <div className="flex px-4 py-2">
                  <div className="flex w-full items-center gap-2">
                    <span className="text-2xl">
                      {!isNil(card.index) ? card.index + 1 : ''}
                    </span>
                    <SortableList.DragHandle className="flex grow justify-end bg-transparent hover:bg-transparent" />
                    <Button
                      variant={'freeStyle'}
                      className="p-0"
                      onClick={() => {
                        handleSwapContent(card.index, {
                          term: card.term,
                          definition: card.definition
                        })
                      }}
                    >
                      <ArrowLeftRight size={20} />
                    </Button>
                    <Button
                      variant={'freeStyle'}
                      className="p-0 transition-all hover:rotate-90"
                      disabled={fields?.length < 3}
                      onClick={() => {
                        handleRemoveCard(card.index)
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                </div>
                <span className="divider-horizontal h-[2px] bg-muted" />
                <div className="flex gap-8 p-4">
                  <FormField
                    name={`cards.${card.index}.term`}
                    control={control}
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormLabel>Term</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-card" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`cards.${card.index}.definition`}
                    control={control}
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormLabel>Definition</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-card" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div>Image</div>
                </div>
              </SortableList.Item>
            )}
          />
        </div>
        <Button
          className="group w-full bg-card py-12 text-foreground hover:bg-card"
          onClick={(e) => {
            e.preventDefault()
            handleAddCard()
          }}
        >
          <div className="relative flex items-center pr-1 transition-all after:absolute after:inset-x-0 after:top-[120%] after:h-1 after:bg-cyan-400 group-hover:after:bg-purple-400">
            <Plus
              size={20}
              strokeWidth={3}
              className="group-hover:text-purple-400"
            />
            <span className="text-lg font-bold group-hover:text-purple-400">
              ADD CARD
            </span>
          </div>
        </Button>
      </form>
    </Form>
  )
}
