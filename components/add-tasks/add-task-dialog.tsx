import { Doc } from "@/convex/_generated/dataModel";
import React, { useEffect } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Calendar, ChevronDown, Flag, Hash, Tag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Task from "../todos/task";
import { AddTaskWrapper } from "./add-task-button";
import SuggestMissingTasks from "./suggest-tasks";
import { useToast } from "../ui/use-toast";

export default function AddTaskDialog({ data }: { data: Doc<"todos"> }) {
  const { taskName, description, projectId, labelId, priority, dueDate, _id } =
    data;
  const project = useQuery(api.projects.getProjectByProjectId, { projectId });
  const label = useQuery(api.labels.getLabelByLabelId, { labelId });

  const { toast } = useToast();

  const inCompleteSubTodosByProject =
    useQuery(api.subTodos.inCompleteSubTodos, { parentId: _id }) ?? [];
  const completeSubTodosByProject =
    useQuery(api.subTodos.completedSubTodos, { parentId: _id }) ?? [];

  const checkASubTodo = useMutation(api.subTodos.checkASubTodo);
  const unCheckASubTodo = useMutation(api.subTodos.unCheckASubTodo);
  const deleteATodoMutation = useMutation(api.todos.deleteATodo);

  const [toDoDetails, setToDoDetails] = React.useState<any>([]);
  useEffect(() => {
    const data = [
      {
        labelName: "Project",
        value: project?.name,
        icon: <Hash className="size-4 text-primary" />,
      },
      {
        labelName: "Due date",
        value: format(dueDate, "MMM dd yyyy"),
        icon: <Calendar className="size-4 text-primary" />,
      },
      {
        labelName: "Priority",
        value: priority,
        icon: <Flag className="size-4 text-primary" />,
      },
      {
        labelName: "Label",
        value: label?.name,
        icon: <Tag className="size-4 text-primary" />,
      },
    ];
    setToDoDetails(data);
  }, []);
  const handleDeleteTodo = (e: any) => {
    e.preventDefault();
    const deletedId = deleteATodoMutation({ taskId: _id });
    if (deletedId !== undefined) {
      toast({
        title: "🗑️ Successfully deleted",
        duration: 3000,
      });
    }
  };
  return (
    <DialogContent className="max-w-4xl lg:h-4/6 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle>{taskName}</DialogTitle>
        <DialogDescription>
          <p className="my-2 capitalize">{description}</p>
          <div className="flex items-center gap-1 mt-12 border-b-2 border-gray-100 pb-2 flex-wrap sm:justify-between lg:gap-0">
            <div className="flex gap-1">
              <ChevronDown className="size-5 text-primary" />
              <p className="font-bold flex text-sm text-gray-900">Sub-tasks</p>
            </div>
            <div>
              <SuggestMissingTasks
                projectId={projectId}
                taskName={taskName}
                description={description}
                parentId={_id}
                isSubTask={true}
              />
            </div>
          </div>
          <div className="pl-4">
            {inCompleteSubTodosByProject.map((task) => {
              return (
                <Task
                  key={task._id}
                  data={task}
                  isCompleted={task.isCompleted}
                  handleOnChange={() => checkASubTodo({ taskId: task._id })}
                />
              );
            })}
            <div className="pb-4">
              <AddTaskWrapper parentTask={data} />
            </div>
            {completeSubTodosByProject.map((task) => {
              return (
                <Task
                  key={task._id}
                  data={task}
                  isCompleted={task.isCompleted}
                  handleOnChange={() => unCheckASubTodo({ taskId: task._id })}
                />
              );
            })}
          </div>
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 bg-gray-100 lg:w-1/2">
        {toDoDetails.map(({ labelName, value, icon }: any, idx: any) => (
          <div
            key={`${value}-${idx}`}
            className="grid gap-2 p-4 border-b-2 w-full"
          >
            <Label className="flex items-start">{labelName}</Label>
            <div className="flex text-left items-center justify-start gap-2 pb-2">
              {icon}
              <p className="text-sm">{value}</p>
            </div>
          </div>
        ))}
        <div className="flex gap-2 p-4 w-full justify-end">
          <form onSubmit={(e) => handleDeleteTodo(e)}>
            <button type="submit">
              <Trash2 className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </DialogContent>
  );
}
