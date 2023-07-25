export interface IPart {
    id: number,
    part_name: string,
    part_number: string,
    part_index: string,
    control_dimensions: Array<Object>,
    drawing_id: number,
    creator_id: string
}