import type { IProject, IProjectTreeNode } from '@/interfaces/app';

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mapProjectToTreeNode(project: IProject): IProjectTreeNode {
    return {
        key: project._id,
        label: project.name,
        children: project.projects?.length ? project.projects.map(mapProjectToTreeNode) : undefined,
    };
}

export function mapProjectsToTree(projects: IProject[]): IProjectTreeNode[] {
    return projects.map(mapProjectToTreeNode);
}

export function useAppTheme(documentElement: any) {
    const style = getComputedStyle(documentElement);

    return {
        fontFamily: 'Inter',
        textColor: style.getPropertyValue('--text-color').trim(),
        axisColor: style.getPropertyValue('--text-color-secondary').trim(),
        backgroundColor: style.getPropertyValue('--surface-card').trim(),
        tooltipBg: style.getPropertyValue('--surface-overlay').trim(),
        borderColor: style.getPropertyValue('--surface-border').trim(),
        gridColor: style.getPropertyValue('--surface-border').trim(),
        primaryColor: style.getPropertyValue('--primary-color').trim(),
        hoverBg: style.getPropertyValue('--surface-hover').trim(),
    };
}
