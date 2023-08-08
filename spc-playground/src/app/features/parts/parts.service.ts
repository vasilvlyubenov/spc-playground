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
export class PartsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  createDrawing(data: Object): Observable<PostgrestSingleResponse<any>> {
    return defer(() => this.supabase.from(`drawings`).insert(data));
  }

  getAllDrawings(): Observable<any> {
    return defer(() => this.supabase.from('drawings').select());
  }

  async uploadDrawingFile(drawingName: string, drawingFile: File): Promise<Object> {
    const generatedName = Date.now().toString();
    const nameToArray = drawingName.split('.');
    const newFileName = `${generatedName}.${
      nameToArray[nameToArray.length - 1]
    }`;
    const {data, error} = await this.supabase.storage.from('public').upload(`drawings/${newFileName}`, drawingFile);
    if (error) {
      throw error;
    }
    return data.path;
  }

  getDrawingFile(filePath: string): Observable<any> {
    return defer(() => this.supabase.storage.from('public').download(`public/${filePath}`));
  }

  createPart(part: Object): Observable<any> {
    return defer(() => this.supabase.from('parts').insert(part));
  }

  getAllParts() {
    return defer(() => this.supabase.from('parts').select(`*, drawings (*)`).order('created_at', {ascending: false}));
  }

  getPartById(partId: string) {
    return defer(() => this.supabase.from('parts').select(`*, drawings (*)`).eq('id', partId));
  }

}
