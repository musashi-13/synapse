export interface TreeNode {
    id: string;
    prompt: string;
    type: 'root' | 'followup' | 'error' | 'sibling';
    children: string[];
    x: number;
    y: number;
    height: number;
    answer?: string; 
}