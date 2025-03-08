import {Input} from "@/components/ui/input.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

const accepting = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv';

const schema = z.object({
  file: z.any()
    .superRefine((file, ctx) => {
      if (!accepting.includes(file?.type)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid file type',
          path: ['file'],
        });
      }

      if (file?.size > 1024 * 1024 * 10) {
        ctx.addIssue({
          code: 'custom',
          message: 'File is too large',
          path: ['file'],
        });
      }
    })
});

function LoadingForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  return (
    <Card className={'max-w-md px-4 py-2'}>
      <Form {...form}>
        <form className={'space-y-1'}>
          <FormField name={'file'} control={form.control} render={({field}) => (
            <FormItem>
              <FormLabel>Choose file to load</FormLabel>
              <FormControl>
                <Input type={'file'} accept={accepting} {...field} />
              </FormControl>
              <FormDescription>
                Only files with the following extensions are allowed: .doc, .docx, .pdf, .xls, .xlsx, .csv
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )} />
          <Button variant={'outline'} type={'submit'}>Load</Button>
        </form>
      </Form>
    </Card>


  )
}

export default LoadingForm;