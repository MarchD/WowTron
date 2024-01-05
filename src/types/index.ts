export  interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

interface ItemBase {
  id: number;
  created: string;
}

export enum EntityTypeEnum {
  Folder = 'Folder',
  File = 'File'
}

export interface FolderType extends ItemBase {
  id: number;
  name: string;
  uri?: never;
  size?: never;
  created: string;
  type: EntityTypeEnum.Folder;
  files?: never;
}

export interface FileType extends ItemBase {
  id: number;
  uri: string;
  size: string;
  created: string;
  name?: never;
  type: EntityTypeEnum.File;
  files?: [];
}

export type ItemType = FileType | FolderType;

export type FilesResponse = FileType[]

export type FolderRequest = { folderId: number };
export type FolderResponse = FileType[]
