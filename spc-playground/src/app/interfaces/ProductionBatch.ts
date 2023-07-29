export interface IProductionBatch {
    id: number,
    batch_number: string,
    control_dimensions_results: string | null,
    spc_dimension_results: string | null,
    part_id: number,
    creator_id: string,
    created_at: string, 
    approval_date: Date,
    end_date: Date | null,
    number_of_cavities: number;
}