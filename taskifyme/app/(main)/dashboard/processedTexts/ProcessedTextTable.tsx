/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
//
import { ProcessedText } from "@/app/lib/mongodb/models";
import { fetchUserProcessedTexts } from "@/app/services/userService";
import {
  deleteProcessedText,
  updateProcessedTextContentToDB,
} from "@/app/services/processedTextService";
import { getFirstTagContent } from "@/app/utils/getFirstTagContent";
import { Sidebar } from "primereact/sidebar";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { v4 as uuidv4 } from "uuid"; // At the top of your file
import { FloatLabel } from "primereact/floatlabel";
import { Checkbox } from "primereact/checkbox";
import { ToggleButton } from "primereact/togglebutton";

interface Props {
  userId: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  date_time: Date | null;
  completed: boolean;
}

const ProcessedTextTable = ({ userId }: Props) => {
  const [refreshTable, setRefreshTable] = useState(false);

  const [deleteProcTextDialog, setDeleteProcTextDialog] = useState(false);
  const [procTextToDelete, setProcTextToDelete] = useState<ProcessedText | null>(null);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any>>(null);

  const [processedTexts, setProcessedTexts] = useState<ProcessedText[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [visibleRight, setVisibleRight] = useState(false);

  const [selectedRowData, setSelectedRowData] = useState<ProcessedText | null>(null); // New state for selected row
  const [summaryContent, setSummaryContent] = useState<string>(""); // Rich text editor content
  const [taskRows, setTaskRows] = useState<any[]>([]); // Tasks array

  // Fetch processed texts
  useEffect(() => {
    const getProcessedTexts = async () => {
      try {
        const data = await fetchUserProcessedTexts(userId);
        setProcessedTexts(
          data.map((processedText) => ({
            ...(processedText.toObject ? processedText.toObject() : processedText),
            content:
              typeof processedText.content === "string"
                ? JSON.parse(processedText.content)
                : processedText.content,
          }))
        );
      } catch (err) {
        console.error("Error fetching processed texts", err);
        setError("Failed to load processed texts");
      } finally {
        setLoading(false);
      }
    };
    getProcessedTexts();
  }, [refreshTable, userId]);

  // Function to trigger a refresh in the Table component
  const handleRefresh = () => {
    setRefreshTable((prev) => !prev); // Toggling state to trigger refresh
  };

  const confirmDeleteProduct = (procTxt: ProcessedText) => {
    setProcTextToDelete(procTxt);
    setDeleteProcTextDialog(true);
  };

  const handleDelete = async () => {
    setDeleteProcTextDialog(false);

    try {
      await deleteProcessedText(procTextToDelete!._id);
      // Update UI to reflect the deleted file
      setProcessedTexts((prevFiles) =>
        prevFiles.filter((file) => file._id.toString() !== procTextToDelete!._id)
      );
      setProcTextToDelete(null);
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Processed Text Deleted",
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting processed text:", error);
      toast.current?.show({
        severity: "error",
        summary: "Delete Failed",
        detail: "Failed to delete processed text.",
        life: 3000,
      });
    }
  };

  const deleteProductDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" text onClick={() => setDeleteProcTextDialog(false)} />
      <Button label="Yes" icon="pi pi-check" text onClick={handleDelete} />
    </>
  );

  // Template for displaying file name
  const fileNameBodyTemplate = (rowData: ProcessedText) => {
    let title = "";
    try {
      title = getFirstTagContent(rowData.content.summary) + " ";
    } catch (error) {
      title = "Add Title";
    }
    if (title.length <= 1) return <p className="text-lg">"..."</p>;
    if (title.length < 40) return <p className="text-lg">{title}</p>;
    return <p className="text-lg">{title.slice(0, 37) + "..."}</p>;
  };

  // Template for displaying date
  const dateBodyTemplate = (rowData: ProcessedText) => {
    return <p>{new Date(rowData.uploadedAt).toLocaleDateString()}</p>;
  };

  // Template for delete action
  const actionDeleteBodyTemplate = (rowData: ProcessedText) => {
    return (
      <Button
        className="mr-2"
        icon="pi pi-trash"
        rounded
        severity="warning"
        onClick={() => confirmDeleteProduct(rowData)}
      />
    );
  };

  // Template for show/edit action
  const actionShowEditBodyTemplate = (rowData: ProcessedText) => {
    return (
      <Button
        rounded
        icon="pi pi-eye"
        severity="success"
        className="mr-2"
        onClick={() => {
          setSelectedRowData(rowData); // Store the clicked row's data
          setVisibleRight(true); // Show the sidebar
          // console.log(rowData);
        }}
      ></Button>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Processed Texts</h5>
    </div>
  );

  // Load row data into state when sidebar is opened
  useEffect(() => {
    if (selectedRowData) {
      let content: any = "";
      // Check if 'content' is a string (needs parsing) or already an object
      if (typeof selectedRowData.content === "string") {
        try {
          content = JSON.parse(selectedRowData.content);
        } catch (error) {
          content = selectedRowData.content;
        }
      } else {
        content = selectedRowData.content;
      }

      // Ensure each task has a unique 'id'
      const tasksWithIds = (content.tasks || []).map((task: Task) => ({
        ...task,
        id: task.id || uuidv4(), // Retain existing 'id' or generate a new one
      }));

      // Update state variables
      setSummaryContent(content.summary || "");
      setTaskRows(tasksWithIds || []);
    }
  }, [selectedRowData]);

  const handleSave = async () => {
    if (selectedRowData) {
      const updatedContent = {
        summary: summaryContent,
        tasks: taskRows,
      };

      // Save the updated content back to the selected row's data
      const updatedRowData = {
        // If it's a Mongoose model, convert it to a plain object
        ...(selectedRowData.toObject ? selectedRowData.toObject() : selectedRowData),
        content: updatedContent,
      };

      // Update state with content as an object
      setProcessedTexts((prevData) =>
        prevData.map((item) => (item._id === selectedRowData._id ? updatedRowData : item))
      );

      try {
        // Stringify content only for database update
        const updatedContentString = JSON.stringify(updatedContent);
        await updateProcessedTextContentToDB(updatedContentString, updatedRowData._id);

        toast.current?.show({
          severity: "success",
          summary: "Saved",
          detail: "Changes have been saved successfully.",
          life: 3000,
        });
      } catch (error) {
        console.error("Error updating processed text:", error);
        toast.current?.show({
          severity: "error",
          summary: "Update Failed",
          detail: "Failed to update processed text.",
          life: 3000,
        });
      }
      setVisibleRight(false);
    }
  };

  // Handle changes in task input fields
  const onTaskEditorValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { value: Date },
    index: number,
    field: keyof Task
  ) => {
    const updatedTasks = [...taskRows];
    if (field === "date_time" && "value" in e) {
      updatedTasks[index][field] = e.value;
    } else if ("target" in e) {
      updatedTasks[index][field] = e.target.value;
    }
    setTaskRows(updatedTasks);
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: uuidv4(),
      title: "",
      description: "",
      date_time: null,
      completed: false,
    };
    setTaskRows((prevTasks) => [...prevTasks, newTask]);
  };

  const handleDeleteTask = (id: string) => {
    setTaskRows((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <DataTable
            ref={dt}
            value={processedTexts}
            selectionMode="single"
            dataKey="_id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            emptyMessage="No processed texts found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              field="summary"
              header="Summary"
              sortable
              body={fileNameBodyTemplate}
              className="align-middle"
              headerStyle={{ minWidth: "15rem" }}
            ></Column>
            <Column
              field="date"
              header="Date"
              sortable
              body={dateBodyTemplate}
              headerStyle={{ minWidth: "7rem" }}
            ></Column>
            <Column
              header="Delete"
              body={actionDeleteBodyTemplate}
              className="text-center"
            ></Column>
            <Column
              header="Show"
              body={actionShowEditBodyTemplate}
              className="text-center"
            ></Column>
          </DataTable>

          <Dialog
            visible={deleteProcTextDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteProductDialogFooter}
            onHide={() => setDeleteProcTextDialog(false)}
          >
            <div className="flex align-items-center justify-content-center">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
              {procTextToDelete && (
                <span>Are you sure you want to delete this Processed Text?</span>
              )}
            </div>
          </Dialog>
        </div>
        <Sidebar
          visible={visibleRight}
          onHide={() => setVisibleRight(false)}
          baseZIndex={1000}
          position="right"
          className="w-full"
        >
          {selectedRowData ? (
            <div>
              <h2>Edit Summary</h2>
              {/* Rich Text Editor */}
              <Editor
                value={summaryContent}
                onTextChange={(e) => setSummaryContent(e.htmlValue || "")}
                style={{ height: "300px" }}
              />

              <h2>Tasks</h2>

              {taskRows.map((task, index) => (
                <div key={index} className="flex mb-3 pt-3">
                  {/* Title & Date Column */}
                  <div className="flex flex-column" style={{ flex: 1 }}>
                    <div className="pb-4">
                      <FloatLabel>
                        <InputText
                          id="title"
                          value={task.title}
                          onChange={(e) => onTaskEditorValueChange(e, index, "title")}
                          style={{ width: "100%" }}
                        />
                        <label htmlFor="title">Title</label>
                      </FloatLabel>
                    </div>
                    <div>
                      <FloatLabel className="py-0 m-0">
                        <Calendar
                          className="py-0 m-0"
                          id="calendar"
                          value={task.date_time ? new Date(task.date_time) : null}
                          onChange={(e) => onTaskEditorValueChange(e, index, "date_time")}
                          dateFormat="dd/mm/yy"
                          showTime
                          hourFormat="24"
                          placeholder="Date Time"
                          style={{ width: "100%", marginTop: "0.5rem" }}
                        />
                        <label htmlFor="calendar">Date & Time</label>
                      </FloatLabel>
                    </div>
                  </div>

                  {/* Description Column */}
                  <div className="flex" style={{ flex: 2, marginLeft: "1rem" }}>
                    <FloatLabel style={{ width: "100%" }}>
                      <InputTextarea
                        id="description"
                        value={task.description}
                        onChange={(e) => onTaskEditorValueChange(e, index, "description")}
                        rows={4}
                        placeholder="Description"
                        style={{ width: "100%" }}
                      />
                      <label htmlFor="description">Description</label>
                    </FloatLabel>
                  </div>

                  {/* Checkbox Column */}
                  <div className="flex align-items-center" style={{ marginLeft: "1rem" }}>
                    <Checkbox
                      id="checkbox"
                      onChange={(e) => {
                        const updatedTasks = [...taskRows];
                        updatedTasks[index].completed = e.target.checked;
                        setTaskRows(updatedTasks);
                      }}
                      checked={task.completed}
                    ></Checkbox>
                  </div>

                  {/* Delete Button Column */}
                  <div className="flex align-items-center" style={{ marginLeft: "1rem" }}>
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-danger"
                      onClick={() => handleDeleteTask(task.id)}
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-content-end mt-3">
                <Button
                  label="Add Task"
                  icon="pi pi-plus"
                  onClick={handleAddTask}
                  className="mr-2"
                />
                <Button label="Save" icon="pi pi-save" onClick={handleSave} />
              </div>
            </div>
          ) : (
            <p>No data selected</p>
          )}
        </Sidebar>
      </div>
    </div>
  );
};

export default ProcessedTextTable;
