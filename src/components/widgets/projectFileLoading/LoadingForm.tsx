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
import {Button} from "@/components/ui/button.tsx";
import axios from "axios";

const accepting = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv';

const schema = z.object({
  file: z.instanceof(FileList).transform(list => list.item(0))
    .refine((file) => {
      if (!file) return false;
      return accepting.split(', ').includes(file.type);
    }, {
      message: 'Invalid file type',
    })
    .refine((file) => {
      if (!file) return false;
      return file.size <= 1024 * 1024 * 10;
    }, {
      message: 'File is too large',
    })
});

function LoadingForm({projectId, setOpen}: { projectId: number, setOpen: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      file: undefined,
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    try {
      console.log(data);
      const formData = new FormData();
      if (data.file) {
        formData.append('file', data.file);
      }

      formData.append('project_id', projectId.toString());
      
      axios.post('/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {console.log(res)}).finally(() => {setOpen(false)});
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Form {...form}>
        <form className={'space-y-1'} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField name={'file'} control={form.control} render={({field: {onChange, value, ...fieldProps}}) => (
            <FormItem>
              <FormLabel>Выберите файл для загрузки</FormLabel>
              <FormControl>
                <Input 
                  type={'file'} 
                  accept={accepting} 
                  onChange={(e) => onChange(e.target.files)}
                  {...fieldProps}
                />
              </FormControl>
              <FormDescription>
                Для загрузки разрешены файлы только с следующими разрешениями: .doc, .docx, .pdf, .xls, .xlsx, .csv
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )} />
          <Button variant={'outline'} type={'submit'}>Загрузить</Button>
        </form>
      </Form>
    </>
  )
}

export default LoadingForm;