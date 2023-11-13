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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/utils/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type CreateQuestionFormProps = {
  className?: string
  refetch?: () => void
}

const formSchema = z.object({
  level: z.string(),
  content: z.string().nonempty('Content is required'),
  audioURL: z.string().optional()
})

const CreateQuestionForm = ({
  className,
  refetch
}: CreateQuestionFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutate: createQuestion } = api.admin.createQuestion.useMutation({
    onSuccess: (data) => {
      if (data) {
        form.reset({
          level: '0',
          content: ''
        })
        setIsDialogOpen(false)
        refetch?.()
      }
    }
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: '0',
      content: ''
    },
    resetOptions: {
      keepIsSubmitSuccessful: false
    }
  })

  const handleOnSubmit = (data: z.infer<typeof formSchema>) => {
    createQuestion({
      level: Number(data.level),
      content: data.content,
      audioURL: data.audioURL
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className={className} asChild>
        <Button
          className="mt-2 flex w-fit cursor-pointer items-center rounded-md border-2 border-accent-foreground p-2 transition-all hover:border-success hover:bg-transparent hover:text-success"
          variant="outline"
        >
          <Plus />
          <span>Add question</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="grid grid-cols-2 gap-2"
          >
            <FormField
              name="level"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question level</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="outline-none">
                          <SelectValue placeholder="Pick a level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Beginner</SelectItem>
                        <SelectItem value="1">Intermediate</SelectItem>
                        <SelectItem value="2">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Question content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Question content"
                      className="max-h-[10rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="col-span-2 ml-auto mt-4">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateQuestionForm
