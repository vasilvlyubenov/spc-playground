export interface IPart {
    id: number,
    part_name: string,
    part_number: string,
    part_index: string,
    control_dimensions: JSON | null,
    spc_dimensions: JSON | null;
    drawing_id: number,
    creator_id: string
}