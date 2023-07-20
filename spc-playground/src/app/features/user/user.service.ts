import { Injectable } from '@angular/core';
import { SupabaseClient, AuthSession, createClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Observable, defer } from 'rxjs';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    debugger
    console.log(this._session);
    
    return this._session;
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signUp(email: string, password: string): Observable<any> {
    return defer(() => this.supabase.auth.signUp({ email, password }));
  }

  signIn(email: string, password: string): Observable<any> {
    return defer(() => this.supabase.auth.signInWithPassword({ email, password }));
  }
}
