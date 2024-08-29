"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction, use, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Text } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { CardFooter } from "../ui/card";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";

const FormSchema = z.object({
  taskName: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  description: z.string().optional().default(""),
  dueDate: z.date({ required_error: "A due date is required" }),
  priority: z.string().min(1, {
    message: "Please select a priority",
  }),
  projectId: z.string().min(1, {
    message: "Please select a project",
  }),
  labelId: z.string().min(1, {
    message: "Please select a label",
  }),
});

export default function AddTaskInline({
  setShowAddTask,
  parentTask,
  projectId: myProjectId,
}: {
  setShowAddTask: Dispatch<SetStateAction<any>>;
  parentTask?: Doc<"todos">;
  projectId?: Id<"projects">;
}) {
  const projectId =
    myProjectId ||
    parentTask?.projectId ||
    ("ks725scwxhcphn7pk55wwpr90n6zarrx" as Id<"projects">);
  const labelId =
    parentTask?.labelId || ("kn76cyeja1h8sqmmdscrq53rd16zan33" as Id<"labels">);
  const priority = parentTask?.priority?.toString() || "1";
  const parentId = parentTask?._id;
  const { toast } = useToast();
  const projects = useQuery(api.projects.getProjects) ?? [];
  const labels = useQuery(api.labels.getLabels) ?? [];

  const createASubTodoEmbeddings = useMutation(api.subTodos.createASubTodo);

  const createTodoEmbeddings = useMutation(api.todos.createATodo);

  const defaultValues = {
    taskName: "",
    description: "",
    priority,
    dueDate: new Date(),
    projectId,
    labelId,
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { taskName, description, priority, dueDate, projectId, labelId } =
      data;

    if (projectId) {
      if (parentId) {
        const mutationId = createASubTodoEmbeddings({
          taskName,
          description,
          parentId,
          priority: parseInt(priority),
          dueDate: moment(dueDate).valueOf(),
          projectId: projectId as Id<"projects">,
          labelId: labelId as Id<"labels">,
        });

        if (mutationId !== undefined) {
          toast({
            title: "🫡 Created a new task",
            duration: 3000,
          });
          form.reset({ ...defaultValues });
        }
      } else {
        const mutationId = createTodoEmbeddings({
          taskName,
          description,
          priority: parseInt(priority),
          dueDate: moment(dueDate).valueOf(),
          projectId: projectId as Id<"projects">,
          labelId: labelId as Id<"labels">,
        });

        if (mutationId !== undefined) {
          toast({
            title: "🫡 Created a new task",
            duration: 3000,
          });
          form.reset({ ...defaultValues });
        }
      }
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 border-2 p-2 border-gray-200 my-2 rounded-xl px-3 pt-4 border-foreground/20"
        >
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="taskName"
                    type="text"
                    placeholder="Enter your task name"
                    required
                    className="border-0 font-semibold text-lg"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-start gap-2">
                    <Text className="size-4 ml-auto mt-2 opacity-50" />
                    <Textarea
                      id="description"
                      placeholder="Description"
                      className="resize-none"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "flex gap-2 w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={priority}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["1", "2", "3", "4"].map((priority, idx) => (
                        <SelectItem key={idx} value={priority.toString()}>
                          Priority {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="labelId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={labelId || field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {labels.map((label: Doc<"labels">, idx) => (
                        <SelectItem key={idx} value={label._id}>
                          {label?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={projectId || field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((project: Doc<"projects">, idx) => (
                      <SelectItem key={idx} value={project._id}>
                        {project?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <CardFooter className="flex flex-col lg:flex-row lg:justify-between gap-2 border-t-2 pt-3">
            <div className="w-full lg:w-1/4"></div>
            <div className="flex gap-3 self-end">
              <Button
                className="bg-gray-300/40 text-gray-950 px-6 hover:bg-gray-300"
                variant={"outline"}
                onClick={() => {
                  setShowAddTask(false);
                }}
              >
                Cancel
              </Button>
              <Button className="px-6" type="submit">
                Add task
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
