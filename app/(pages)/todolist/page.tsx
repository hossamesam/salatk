"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { deleteMission, Missionstatus, setMission, updateMissionObject, updateMissionStatus } from "@/redux/mission/missionSlice";
import React, { useState } from "react";
import { toast } from "sonner";

const tableHeaders = [
    { id: 1, name: "تحديد" },
    { id: 2, name: "المهمة" },
    { id: 3, name: "الحاله" },
    { id: 4, name: "الغاء" },
]



export default function TodoListPage() {
    const dispatch = useAppDispatch();
    const mission = useAppSelector((state) => state.missions.mission);

    const [task, settask] = useState<string>("");
    const [editId, setEditId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [selected, setSelected] = useState<string[]>([]);

    const handleSelect = (id: string, checked: boolean) => {
        setSelected(prev =>
            checked ? [...prev, id] : prev.filter(mid => mid !== id)
        );
    };
    const handleBulkAction = (action: "delete" | "success" | "warn" | "fail") => {
        if (action === "delete") {
            selected.forEach(id => dispatch(deleteMission({ missionId: id })));
            toast.error("تم حذف المهام المحددة");
        } else {
            let status = Missionstatus.Warn;
            if (action === "success") status = Missionstatus.Succeeded;
            if (action === "fail") status = Missionstatus.Failed;
            selected.forEach(id => dispatch(updateMissionStatus({ missionId: id, missionStatus: status })));
            toast.success("تم تحديث حالة المهام المحددة");
        }
        setSelected([]);
    };

    return (
        <div className=" p-8">
            <h1 className="text-2xl font-bold mb-4 text-center text-emerald-700">قائمة المهام</h1>
            <div className="flex gap-2 mb-4">
                <Input onChange={(e) => settask(e.target.value)} type="text" name="todo" placeholder="Add a new task" />
                <Input onClick={() => dispatch(setMission({ missionObject: task }))} onChange={(e) => settask(e.target.value)} type="button" value="Add" className={`bg-emerald-600 w-fit hover:bg-emerald-700 text-white font-bold px-4 `} />
            </div>
            <Toaster richColors />
            {selected.length > 0 && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-white border shadow-lg rounded-xl flex gap-2 px-6 py-3 items-center">
                    <span className="font-bold text-emerald-700">تم تحديد {selected.length} مهمة</span>
                    <Button variant="destructive" size="sm" onClick={() => handleBulkAction("delete")}>حذف</Button>
                    <Button variant="success" size="sm" onClick={() => handleBulkAction("success")}>نجحت</Button>
                    <Button variant="warn" size="sm" onClick={() => handleBulkAction("warn")}>قيد الانتظار</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleBulkAction("fail")}>فشلت</Button>
                </div>
            )}
            <Table >
                <TableHeader>
                    {tableHeaders.map((header) => (
                        <TableHead key={header.id} className={`text-emerald-600 ${header.id == 1 ? "w-sm" : "w-full"}   font-bold text-lg text-center`}>
                            {header.name}
                        </TableHead>
                    ))}
                </TableHeader>
                {mission.map((mission) =>
                    <TableBody key={mission.missionId}>
                        <TableCell className="w-sm">
                            <Input
                                type="checkbox"
                                className="w-fit"
                                checked={selected.includes(mission.missionId)}
                                onChange={e => handleSelect(mission.missionId, e.target.checked)}
                            />
                        </TableCell>
                        <TableCell
                            className=" whitespace-break-spaces"
                            key={mission.missionId}
                        >
                            {editId === mission.missionId ? (
                                <Input
                                    autoFocus
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    onBlur={() => {
                                        dispatch(updateMissionObject({ missionId: mission.missionId, missionObject: editValue }));
                                        setEditId(null);
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            dispatch(updateMissionObject({ missionId: mission.missionId, missionObject: editValue }));
                                            setEditId(null);
                                        } else if (e.key === "Escape") {
                                            setEditId(null);
                                        }
                                    }}
                                />
                            ) : (
                                <div onDoubleClick={() => {
                                    setEditId(mission.missionId);
                                    setEditValue(mission.missionObject ?? "");
                                }}>
                                    {mission.missionObject}
                                </div>
                            )}
                        </TableCell>
                        <TableCell className="flex justify-center  gap-2 text-center items-center  min-w-68" >
                            <Button onClick={() => dispatch(updateMissionStatus({ missionId: mission.missionId, missionStatus: Missionstatus.Succeeded }))} disabled={mission.missionStatus == Missionstatus.Succeeded} variant={mission.missionStatus !== Missionstatus.Succeeded ? "outlinesuccess" : "success"} size="sm">
                                نجحت
                            </Button>
                            <Button onClick={() => dispatch(updateMissionStatus({ missionId: mission.missionId, missionStatus: Missionstatus.Warn }))} disabled={mission.missionStatus == Missionstatus.Warn} variant={mission.missionStatus !== Missionstatus.Warn ? "outlinewarn" : "warn"} size="sm">
                                قيد الانتظار
                            </Button>
                            <Button onClick={() => dispatch(updateMissionStatus({ missionId: mission.missionId, missionStatus: Missionstatus.Failed }))} disabled={mission.missionStatus == Missionstatus.Failed} variant={mission.missionStatus !== Missionstatus.Failed ? "outlineerror" : "destructive"} size="sm">
                                فشلت
                            </Button>

                        </TableCell>
                        <TableCell className="align-top w-sm ">
                            <Button className="cursor-pointer" variant={"destructive"} onClick={() => dispatch(deleteMission({ missionId: mission.missionId }))} size="sm">
                                X
                            </Button>
                        </TableCell>
                    </TableBody>
                )}

            </Table>
        </div >
    );
}

