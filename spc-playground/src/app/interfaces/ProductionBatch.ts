export interface IProductionBatch {
    id: number,
    batch_number: string,
    control_dimensions_results: string,
    spc_dimension_results: string,
    part_id: number,
    creator_id: string,
    created_at: string, 
    approval_date: Date,
    end_date: Date,
    number_of_cavities: number;
}