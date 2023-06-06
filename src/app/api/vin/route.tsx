import { NextResponse } from "next/server";
import { ImageAnnotatorClient } from "@google-cloud/vision";

export async function POST(req: Request) {
  const formData = await req.formData();
  const image = formData.get("image") as File;

  const client = new ImageAnnotatorClient({
    credentials: {
      type: "service_account",
      private_key: process.env
        .GOOGLE_PRIVATE_KEY!.split(String.raw`\n`)
        .join("\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
    },
  });
  const [result] = await client.textDetection(
    Buffer.from(await image.arrayBuffer())
  );
  const detections = result.textAnnotations;
  console.log(
    "full text annotations for",
    image.name,
    " :",
    result.fullTextAnnotation?.text
  );
  if (!detections) {
    return NextResponse.json({ thing: "noDetections" });
  }
  var vinNumber = "";
  detections.forEach((text) => {
    if (!text.description) {
      return;
    }
    const words = text.description.split(" ");

    words.forEach((word, i) => {
      const trim = word.trim();
      if (trim.length == 17) {
        vinNumber = trim;
      }

      if (words[i - 1] && words[i - 1].trim().length + trim.length === 17) {
        vinNumber = words[i - 1].trim() + trim;
      }
      if (words[i + 1] && trim.length + words[i + 1].trim().length === 17) {
        vinNumber = trim + words[i + 1].trim();
      }
    });
  });

  return NextResponse.json({ vinNumber });
}
