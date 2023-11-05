import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type CreateCourseFormProps = {
  className?: string
}

const formSchema = z.object({
  title: z.string().nonempty('Title is required')
})

const CreateCourseForm = ({ className }: CreateCourseFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const handleOnSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
  }

  return (
    <Dialog>
      <DialogTrigger className={className} asChild>
        <Button
          className="mt-2 flex w-fit cursor-pointer items-center rounded-md border-2 border-accent-foreground p-2 transition-all hover:border-success hover:bg-transparent hover:text-success"
          variant="outline"
        >
          <Plus />
          <span>Add course</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[70rem] max-h-[90vh] max-w-[90vw]">
        <div className="flex">
          <div className="flex h-full w-[20rem] flex-col">
            <span className="w-full text-center text-2xl font-bold">
              Properties
            </span>
            <Form {...form}>
              <form onSubmit={void form.handleSubmit(handleOnSubmit)}>
                <FormField
                  name="courseLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
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
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCourseForm
