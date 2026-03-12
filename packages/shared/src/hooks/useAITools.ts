"use client";
import { useState, useCallback } from "react";

export interface AITaskLog {
  id: string;
  tool: string;
  action: string;
  timestamp: string;
  status: "success" | "running" | "failed";
  result?: string;
}

export function useAITools() {
  const [logs, setLogs] = useState<AITaskLog[]>([]);
  const [activeTasks, setActiveTasks] = useState<Record<string, boolean>>({});

  const runTask = useCallback(
    async (
      tool: string,
      action: string,
      serverAction?: () => Promise<unknown>,
    ) => {
      const taskId = `task_${Date.now()}`;

      setActiveTasks((prev) => ({ ...prev, [tool]: true }));
      setLogs((prev) =>
        [
          {
            id: taskId,
            tool,
            action,
            timestamp: new Date().toISOString(),
            status: "running" as const,
          },
          ...prev,
        ].slice(0, 50),
      );

      try {
        let resultText = "";
        if (serverAction) {
          const res = await serverAction();
          resultText =
            typeof res === "string" ? res : JSON.stringify(res, null, 2);
        }

        setActiveTasks((prev) => ({ ...prev, [tool]: false }));
        setLogs((prev) =>
          prev.map((log) =>
            log.id === taskId
              ? { ...log, status: "success" as const, result: resultText }
              : log,
          ),
        );
      } catch {
        setActiveTasks((prev) => ({ ...prev, [tool]: false }));
        setLogs((prev) =>
          prev.map((log) =>
            log.id === taskId ? { ...log, status: "failed" as const } : log,
          ),
        );
      }
    },
    [],
  );

  return { logs, activeTasks, runTask };
}
