export interface IProductionLot {
    id: number,
    lot: string,
    control_dimensions_results: JSON,
    spc_dimension_results: JSON,
    part_id: number,
    creator_id: string,
    created_at: string, 
}