import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import AddTaskInline from "./add-task-inline";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const AddTaskWrapper = ({
  parentTask,
  projectId,
}: {
  parentTask?: Doc<"todos">;
  projectId?: Id<"projects">;
}) => {
  const [ShowAddTask, setShowAddTask] = useState(false);

  return ShowAddTask ? (
    <AddTaskInline
      setShowAddTask={setShowAddTask}
      parentTask={parentTask}
      projectId={projectId}
    />
  ) : (
    <AddTaskButton
      onClick={() => setShowAddTask(true)}
      title={parentTask?._id ? "Add sub-task" : "Add task"}
    />
  );
};

export default function AddTaskButton({
  onClick,
  title,
}: {
  onClick: Dispatch<SetStateAction<any>>;
  title: string;
}) {
  return (
    <button onClick={onClick} className="flex flex-1 pl-2 mt-2">
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <div className="flex items-center justify-center gap-2 ">
          <Plus className="size-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white" />
          <h3 className="text-base font-light tracking-tight text-foreground/70">
            {title}
          </h3>
        </div>
      </div>
    </button>
  );
}
