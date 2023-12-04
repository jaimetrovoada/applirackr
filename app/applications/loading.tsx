import { Skeleton } from "@/components";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="w-full overflow-auto rounded-lg border border-gray-600/50">
        <table className="w-full">
          <thead className="hidden md:table-header-group">
            <tr className="bg-zinc-950">
              <th className="p-2 text-left" colSpan={1}>
                Position
              </th>
              <th className="p-2 text-left" colSpan={1}>
                Company
              </th>
              <th className="p-2 text-left" colSpan={1}>
                Stage
              </th>
              <th className="p-2 text-left" colSpan={1}>
                Date Applied
              </th>
              <th className="p-2 text-left" colSpan={1}>
                Job Post URl
              </th>
              <th className="p-2 text-left" colSpan={1}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="group flex flex-col odd:bg-zinc-800/50 md:table-row">
              <td className="flex flex-col p-2 py-3 md:table-cell">
                <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
                  Position
                </span>
                <Skeleton className="w-full" />
              </td>
              <td className="flex flex-col p-2 py-3 md:table-cell">
                <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
                  Company
                </span>
                <Skeleton className="w-full" />
              </td>
              <td className="flex flex-col p-2 py-3 md:table-cell">
                <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
                  Stage
                </span>
                <Skeleton className="w-full" />
              </td>
              <td className="flex flex-col p-2 py-3 md:table-cell">
                <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
                  Date Applied
                </span>
                <Skeleton className="w-full" />
              </td>
              <td className="flex flex-col p-2 py-3 md:table-cell">
                <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
                  Job Post URl
                </span>
                <Skeleton className="w-full" />
              </td>
              <td className="flex flex-col p-2 py-3 md:table-cell">
                <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
                  Actions
                </span>
                <Skeleton className="w-full" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Loading;
