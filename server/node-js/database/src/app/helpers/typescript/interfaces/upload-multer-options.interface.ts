export interface IUploadMulterOptions {
  storage: any;
  limits: { fileSize: number };
  // @ts-ignore
  fileFilter: (req, file, next) => void
}
