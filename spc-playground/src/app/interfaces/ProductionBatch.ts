export interface IProductionBatch {
    id: number,
    batch_number: string,
    control_dimensions_results: string | null,
    spc_dimension_results: string | null,
    part_id: number,
    creator_id: string,
    created_at: string, 
    approval_date: Date,
    closed_date: Date | null,
    closed_by: string | null,
    number_of_cavities: number;
}