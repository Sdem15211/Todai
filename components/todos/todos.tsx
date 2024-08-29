import React from "react";
import Task from "./Task";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useToast } from "../ui/use-toast";

export default function Todos({
  items,
  showDetails,
}: {
  items: Array<Doc<"todos">>;
  showDetails?: boolean;
}) {
  const checkATodo = useMutation(api.todos.checkATodo);
  const unCheckATodo = useMutation(api.todos.unCheckATodo);
  const { toast } = useToast();

  const handleOnChangeTodo = (task: Doc<"todos">) => {
    if (task.isCompleted) {
      unCheckATodo({ taskId: task._id });
    } else {
      checkATodo({ taskId: task._id });
      toast({
        title: "✅ Task completed",
        description: "You're a rockstar",
        duration: 3000,
      });
    }
  };
  return items.map((task: Doc<"todos">, idx) => (
    <Task
      key={task._id}
      handleOnChange={() => handleOnChangeTodo(task)}
      data={task}
      isCompleted={task.isCompleted}
      showDetails={showDetails}
    />
  ));
}
