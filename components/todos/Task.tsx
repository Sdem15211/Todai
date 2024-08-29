import clsx from "clsx";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddTaskDialog from "@/components/add-tasks/add-task-dialog";
import { Doc } from "@/convex/_generated/dataModel";
import { Calendar, GitBranch } from "lucide-react";
import moment from "moment";

function isSubTodo(
  data: Doc<"todos"> | Doc<"subTodos">
): data is Doc<"subTodos"> {
  return "parentId" in data;
}

export default function Task({
  data,
  isCompleted,
  handleOnChange,
  showDetails = false,
}: {
  data: Doc<"todos"> | Doc<"subTodos">;
  isCompleted: boolean;
  handleOnChange: any;
  showDetails?: boolean;
}) {
  const { taskName, dueDate } = data;
  return (
    <div
      key={data._id}
      className="flex items-center space-x-2 p-2 border-b-2 border-gray-100 animate-in fade-in"
    >
      <Dialog>
        <div className="flex gap-2 items-center justify-end w-full">
          <div className="flex gap-2 w-full">
            <Checkbox
              onCheckedChange={handleOnChange}
              id="todo"
              checked={isCompleted}
              className={clsx(
                "w-5 h-5 rounded-xl",
                isCompleted &&
                  "data-[state=checked]:bg-gray-300 border-gray-300"
              )}
            />
            <DialogTrigger asChild>
              <div className="flex flex-col items-start">
                <button
                  className={clsx(
                    "text-sm font-normal text-left",
                    isCompleted && "line-through text-foreground/30"
                  )}
                >
                  {taskName}
                </button>
                {showDetails && (
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center gap-1">
                      <GitBranch className="size-3 text-foreground/70" />
                      <p className="text-xs text-foreground/70">1</p>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="size-3 text-primary" />
                      <p className="text-xs text-primary">
                        {moment(dueDate).format("LL")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </DialogTrigger>
          </div>
          {!isSubTodo(data) && <AddTaskDialog data={data} />}
        </div>
      </Dialog>
    </div>
  );
}
