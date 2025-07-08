import type { IProject, IProjectTreeNode } from '@/interfaces/app';


export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mapProjectToTreeNode(project: IProject): IProjectTreeNode {
  return {
    key: project._id,
    label: project.name,
    children: project.projects?.length
      ? project.projects.map(mapProjectToTreeNode)
      : undefined
  };
}

function mapProjectsToTree(projects: IProject[]): IProjectTreeNode[] {
  return projects.map(mapProjectToTreeNode);
}

