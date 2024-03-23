import { EventSourceData } from '@type/api';

export const parseEventSource = (
  data: string
): '[DONE]' | EventSourceData[] => {
  const result = data
    .split(/\n?data: /)
    .slice(1)
    .map((chunk) => {
      if (chunk.trim() === '[DONE]') return '[DONE]';
      try {
        const parsedData = JSON.parse(chunk.trim());
        return parsedData as EventSourceData;
      } catch {
        return null;
      }
    })
    .filter((item): item is EventSourceData | '[DONE]' => item !== null);
  return result;
};

export const createMultipartRelatedBody = (
  metadata: object,
  file: File,
  boundary: string
): Blob => {
  const encoder = new TextEncoder();

  const metadataPart = encoder.encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
      metadata
    )}\r\n`
  );
  const filePart = encoder.encode(
    `--${boundary}\r\nContent-Type: ${file.type}\r\n\r\n`
  );
  const endBoundary = encoder.encode(`\r\n--${boundary}--`);

  return new Blob([metadataPart, filePart, file, endBoundary], {
    type: 'multipart/related; boundary=' + boundary,
  });
};
