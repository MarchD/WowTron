export  interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface FileType  {
  id: number;
  uri: string;
  size: string;
  created: string;
}

export type FilesResponse = FileType[]
