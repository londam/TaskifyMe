import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb/dbConnect";
import { ProcessedTextModel } from "@/app/lib/mongodb/models";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  //in RL fetch data from a db,
  await dbConnect(); // Ensure database connection is established
  const processedText = await ProcessedTextModel.findById(params.id);

  //if not found return 404
  // else return data
  if (!processedText)
    return NextResponse.json({ error: "Processed text not found" }, { status: 404 });

  return NextResponse.json(processedText, { status: 200 });
}

//PUT for replacing object
//PATCH for updating a property of an object

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect(); // Ensure database connection is established
  //validate the request body
  const body = await request.json();
  const { processedTextContent } = body;

  console.log(
    "_____________________________SUCCESS modifying the db entry_____________________________",
    processedTextContent
  );
  // update the audioFile
  const updatedProcessedText = await ProcessedTextModel.findByIdAndUpdate(
    params.id,
    { content: processedTextContent },
    {
      new: true, // return the updated version
    }
  );
  console.log(
    "_____________________________SUCCESS modifying the db entry_____________________________",
    updatedProcessedText._id
  );
  console.log(
    "_____________________________SUCCESS modifying the db entry_____________________________",
    updatedProcessedText.content
  );

  return NextResponse.json(updatedProcessedText);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect(); // Ensure database connection is established

  try {
    // Fetch the audioFile by ID before deletion
    const processedText = await ProcessedTextModel.findById(params.id);

    // If the processedText does not exist, return 404
    if (!processedText)
      return NextResponse.json({ error: "Processed Text not found" }, { status: 404 });

    // Delete the audioFile by ID
    const result = await ProcessedTextModel.deleteOne({ _id: params.id });

    // Check if a document was deleted
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Return the deleted audioFile
    return NextResponse.json(processedText, { status: 200 });
  } catch (error) {
    console.error("Error deleting audioFile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
