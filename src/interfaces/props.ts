import type { RouteRecordRaw } from 'vue-router'

export interface IAppRouteMeta {
  title?: string
  icon?: string
  showInSidebar?: boolean
  dividerComesAfter?: boolean
}

export interface IAppRoute extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: IAppRouteMeta
  children?: IAppRoute[]
}