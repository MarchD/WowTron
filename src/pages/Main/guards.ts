import { EntityTypeEnum, FolderType, ItemType } from '../../types';

export const isFolder = (item: ItemType): item is FolderType => {
  return item.type === EntityTypeEnum.Folder;
}
