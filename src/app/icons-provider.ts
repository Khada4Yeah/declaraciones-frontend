import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline,
  CarOutline,
  UserOutline,
  FileTextOutline,
  ToolOutline,
  EyeInvisibleOutline,
  LockOutline,
  UploadOutline,
  DownloadOutline,
  DeleteOutline,
  FolderOutline,
  FileOutline,
  InboxOutline,
  PlusOutline,
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

const icons = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  FormOutline,
  CarOutline,
  UserOutline,
  FileTextOutline,
  ToolOutline,
  EyeInvisibleOutline,
  LockOutline,
  UploadOutline,
  DownloadOutline,
  DeleteOutline,
  FolderOutline,
  FileOutline,
  InboxOutline,
  PlusOutline,
];

export function provideNzIcons(): EnvironmentProviders {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}
