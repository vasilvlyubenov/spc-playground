import { Injectable } from '@angular/core';
import {
  SupabaseClient,
  createClient,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';
import { Observable, defer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BatchService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  createBatch(data: Object): Observable<PostgrestSingleResponse<any>> {
    return defer(() => this.supabase.from('production-batches').insert(data));
  }

  getAllPartBatches(partId: string): Observable<PostgrestSingleResponse<any>> {
    return defer(()=> this.supabase.from('production-batches').select().eq('part_id', partId).order('approval_date', {ascending: false}));
  }

  getBatchById(batchId: string): Observable<PostgrestSingleResponse<any>> {
    return defer(() => this.supabase.from('production-batches').select().eq('id', batchId));
  }

  closeBatch(batchId:string, closedBy: string, closedDate: Date): Observable<PostgrestSingleResponse<any>> {
    return defer(() => this.supabase.from('production-batches').update({ closed_by: closedBy, closed_date: closedDate}).eq('id', batchId));
  }

  insertSpcDimensions(batchId: string, measurements: string): Observable<PostgrestSingleResponse<any>>  {
    return defer(() => this.supabase.from('production-batches').update({spc_dimension_results: measurements}).eq('id', batchId));
  }

  getBatchForSpc(batchId: string): Observable<PostgrestSingleResponse<any>> {
    return defer(() => this.supabase.from('production-batches').select(`*, parts (*)`).eq('id', batchId).order('approval_date', {ascending: false}));
  }
}
