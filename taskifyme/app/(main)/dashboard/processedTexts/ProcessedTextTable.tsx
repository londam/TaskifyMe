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
import { deleteProcessedText } from "@/app/services/processedTextService";

interface Props {
  userId: string;
}

const ProcessedTextTable = ({ userId }: Props) => {
  const [refreshAudioTable, setRefreshAudioTable] = useState(false);

  const [deleteProcTextDialog, setDeleteProcTextDialog] = useState(false);
  const [procTextToDelete, setProcTextToDelete] = useState<ProcessedText | null>(null);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any>>(null);

  const [processedTexts, setProcessedTexts] = useState<ProcessedText[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProcessedTexts = async () => {
      try {
        const data = await fetchUserProcessedTexts(userId);
        setProcessedTexts(data);
      } catch (err) {
        console.error("Error fetching processed texts", err);
        setError("Failed to load processed texts");
      } finally {
        setLoading(false);
      }
    };
    getProcessedTexts();
  }, [refreshAudioTable]);

  // Function to trigger a refresh in the AudioTable component
  const handleRefresh = () => {
    setRefreshAudioTable((prev) => !prev); // Toggling state to trigger refresh
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
    return <p>{rowData.content.slice(0, 20)}</p>;
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

  const actionTranscribeBodyTemplate = (rowData: ProcessedText) => {
    return <></>;
    // return <TranscribeButton audioFile={rowData} />;
  };

  const actionProcessBodyTemplate = (rowData: ProcessedText) => {
    return <></>;
    // return <>{rowData.sttId && <ProcessTextButton sttId={rowData.sttId?.toString()} />}</>;
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Processed Texts</h5>
    </div>
  );

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
              field="fileName"
              header="File Name"
              sortable
              body={fileNameBodyTemplate}
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
              header="Transcribe"
              body={actionTranscribeBodyTemplate}
              className="text-center"
            ></Column>
            <Column
              header="Process"
              body={actionProcessBodyTemplate}
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
      </div>
    </div>
  );
};

export default ProcessedTextTable;
