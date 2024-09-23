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
  saveNewProcessedTextToDB,
  updateProcessedTextContentToDB,
} from "@/app/services/processedTextService";
import { getFirstTagContent } from "@/app/utils/getFirstTagContent";
import { Sidebar } from "primereact/sidebar";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";

interface Props {
  userId: string;
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

  useEffect(() => {
    const getProcessedTexts = async () => {
      try {
        const data = await fetchUserProcessedTexts(userId);
        setProcessedTexts(
          data.map((processedText) => ({
            ...(processedText.toObject ? processedText.toObject() : processedText),
            content: JSON.parse(processedText.content),
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
  }, [refreshTable]);

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

  const fileNameBodyTemplate = (rowData: ProcessedText) => {
    let title = "";
    try {
      const content = JSON.parse(rowData.content);
      title = getFirstTagContent(content.summary) + " ";
    } catch (error) {
      title = "";
    }
    if (title.length <= 1) return <p className="text-lg">"..."</p>;
    if (title.length < 40) return <p className="text-lg">{title}</p>;
    return <p className="text-lg">{title.slice(0, 37) + "..."}</p>;
  };

  const dateBodyTemplate = (rowData: ProcessedText) => {
    return <p>{new Date(rowData.uploadedAt).toLocaleDateString()}</p>;
  };

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
          console.log(rowData);
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
      let content = "";
      try {
        content = JSON.parse(selectedRowData.content);
      } catch (error) {
        content = selectedRowData.content;
      }
      setSummaryContent(content.summary || "");
      setTaskRows(content.tasks || []);
    }
  }, [selectedRowData]);

  const handleSave = async () => {
    if (selectedRowData) {
      const updatedContent = JSON.stringify({
        summary: summaryContent,
        tasks: taskRows,
      });

      // Save the updated content back to the selected row's data
      const updatedRowData = {
        // If it's a Mongoose model, convert it to a plain object
        ...(selectedRowData.toObject ? selectedRowData.toObject() : selectedRowData),
        content: updatedContent,
      };

      setProcessedTexts((prevData) =>
        prevData.map((item) => (item._id === selectedRowData._id ? updatedRowData : item))
      );

      updateProcessedTextContentToDB(updatedContent, updatedRowData._id);

      toast.current?.show({
        severity: "success",
        summary: "Saved",
        detail: "Changes have been saved successfully.",
        life: 3000,
      });
      setVisibleRight(false);
    }
  };

  const taskCheckboxTemplate = (rowData: any, rowIndex: number) => {
    return (
      <input
        type="checkbox"
        checked={rowData.completed}
        onChange={(e) => {
          const updatedTasks = [...taskRows];
          updatedTasks[rowIndex].completed = e.target.checked;
          setTaskRows(updatedTasks);
        }}
      />
    );
  };

  const onTaskEditorValueChange = (e: any, rowIndex: number, field: string) => {
    const updatedTasks = [...taskRows];
    updatedTasks[rowIndex][field] = e.target.value;
    setTaskRows(updatedTasks);
  };

  const taskEditorTemplate = (rowData: any, field: string, rowIndex: number) => {
    return (
      <InputText
        value={rowData[field]}
        onChange={(e) => onTaskEditorValueChange(e, rowIndex, field)}
      />
    );
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
            emptyMessage="No products found."
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
                style={{ height: "200px" }}
              />

              <h2>Tasks</h2>
              <DataTable value={taskRows} editMode="cell">
                <Column
                  field="taskName"
                  header="Task Name"
                  body={(rowData, { rowIndex }) => taskEditorTemplate(rowData, "title", rowIndex)}
                ></Column>
                <Column
                  field="taskDescription"
                  header="Task Description"
                  body={(rowData, { rowIndex }) =>
                    taskEditorTemplate(rowData, "description", rowIndex)
                  }
                ></Column>
                <Column
                  field="dueDate"
                  header="Due Date"
                  body={(rowData, { rowIndex }) =>
                    taskEditorTemplate(rowData, "date_time", rowIndex)
                  }
                ></Column>
                <Column
                  header="Completed"
                  body={(rowData, { rowIndex }) => taskCheckboxTemplate(rowData, rowIndex)}
                ></Column>
              </DataTable>
              <Button label="Save" icon="pi pi-save" onClick={handleSave} className="mt-3" />
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
