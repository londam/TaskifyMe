/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import FileUploadPR from "./FileUploadPR";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
//
import { AudioFile } from "@/app/lib/mongodb/models";
import AudioPlayer from "./AudioPlayer";
import TranscribeButton from "./TranscribeButton";
import ProcessTextButton from "./ProcessTextButton";
import { fetchUserAudioFiles } from "@/app/services/userService";
import { deleteAudioFile } from "@/app/services/audioFileService";

interface Props {
  userId: string;
}

const AudioTablePR = ({ userId }: Props) => {
  const [refreshAudioTable, setRefreshAudioTable] = useState(false);

  const [deleteAudioDialog, setDeleteAudioDialog] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<AudioFile | null>(null);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any>>(null);

  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // !! Better way of doing stuff is to get services into separate files
  // useEffect(() => {
  //   AudioFileService.getProducts().then((data) => setProducts(data as any));
  // }, []);

  useEffect(() => {
    const getAudioFiles = async () => {
      try {
        const data = await fetchUserAudioFiles(userId);
        setAudioFiles(data);
      } catch (err) {
        console.error("Error fetching audio files:", err);
        setError("Failed to load audio files");
      } finally {
        setLoading(false);
      }
    };
    getAudioFiles();
  }, [refreshAudioTable]);

  // Function to parse the file name and extract the date and initial file name
  const parseFileName = (fileName: string) => {
    const underscoreIndex = fileName.indexOf("_"); // Find the first occurrence of "_"
    // Use slice to get everything after the first underscore
    return fileName.slice(underscoreIndex + 1);
  };

  // Function to trigger a refresh in the AudioTable component
  const handleRefresh = () => {
    setRefreshAudioTable((prev) => !prev); // Toggling state to trigger refresh
  };

  const confirmDeleteProduct = (audioFile: AudioFile) => {
    setAudioToDelete(audioFile);
    setDeleteAudioDialog(true);
  };

  const handleDelete = async () => {
    setDeleteAudioDialog(false);

    try {
      await deleteAudioFile(audioToDelete!._id, audioToDelete!.fileName);
      // Update UI to reflect the deleted file
      setAudioFiles((prevFiles) =>
        prevFiles.filter((file) => file._id.toString() !== audioToDelete!._id)
      );
      setAudioToDelete(null);
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Product Deleted",
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting audio file:", error);
      toast.current?.show({
        severity: "error",
        summary: "Delete Failed",
        detail: "Failed to delete audio file.",
        life: 3000,
      });
    }
  };

  const deleteProductDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" text onClick={() => setDeleteAudioDialog(false)} />
      <Button label="Yes" icon="pi pi-check" text onClick={handleDelete} />
    </>
  );

  const fileNameBodyTemplate = (rowData: AudioFile) => {
    return <p>{parseFileName(rowData.fileName)}</p>;
  };

  const dateBodyTemplate = (rowData: AudioFile) => {
    return <p>{new Date(rowData.uploadedAt).toLocaleDateString()}</p>;
  };

  const playerBodyTemplate = (rowData: AudioFile) => {
    return (
      <>
        <AudioPlayer audioFileId={rowData._id} />
      </>
    );
  };

  const actionDeleteBodyTemplate = (rowData: AudioFile) => {
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

  const actionTranscribeBodyTemplate = (rowData: AudioFile) => {
    return <TranscribeButton audioFile={rowData} />;
  };

  const actionProcessBodyTemplate = (rowData: AudioFile) => {
    return <>{rowData.stt && <ProcessTextButton sttId={rowData.stt?.toString()} />}</>;
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Audios</h5>
      <FileUploadPR onUploadSuccess={handleRefresh} />
    </div>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <DataTable
            ref={dt}
            value={audioFiles}
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
            <Column body={playerBodyTemplate} headerStyle={{ minWidth: "8rem" }}></Column>
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
            visible={deleteAudioDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteProductDialogFooter}
            onHide={() => setDeleteAudioDialog(false)}
          >
            <div className="flex align-items-center justify-content-center">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
              {audioToDelete && (
                <span>
                  Are you sure you want to delete <b>{audioToDelete.fileName}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AudioTablePR;
