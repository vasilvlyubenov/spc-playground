import { Injectable, OnDestroy } from '@angular/core';
import {
  SupabaseClient,
  AuthSession,
  createClient,
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable, Subscription, defer, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private user$$ = new BehaviorSubject<any>(undefined);
  public user$ = this.user$$.asObservable();

  subscription!: Subscription;
  sessionSubscription: Subscription | undefined;
  newPassSubscription: Subscription | undefined;
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;
  user!: Object | undefined;

  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data.session;
  }

  get isLogged(): Object | null {
    return !!this.user;
  }

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.subscription = this.user$.subscribe((user) => {
      if (!user) {
        return;
      }

      if (user.data) {
        this.user = user;
      } else {
        this.user = undefined;
      }
    });
  }

  getUser():Observable<any> {
    return defer(() => this.supabase.auth.getUser());
  }

  // authChanges(
  //   callback: (event: AuthChangeEvent, session: Session | null) => void
  // ) {
  //   return this.supabase.auth.onAuthStateChange(callback);
  // }

  signUp(email: string, password: string): Observable<any> {
    const register$ = defer(() =>
      this.supabase.auth.signUp({ email, password })
    ).pipe(tap((data) => this.user$$.next(data)));
    return register$;
  }

  signIn(email: string, password: string): Observable<any> {
    const login$ = defer(() =>
      this.supabase.auth.signInWithPassword({ email, password })
    ).pipe(tap((data) => this.user$$.next(data)));

    return login$;
  }

  signOut(): Observable<any> {
    return defer(() => this.supabase.auth.signOut()).pipe(
      tap((data) => this.user$$.next(data))
    );
  }

  refreshSession(data: any): Observable<any> {
    return defer(() => this.supabase.auth.refreshSession(data)).pipe(
      tap((data) => this.user$$.next(data))
    );
  }

  async updatePassword(password: string): Promise<Object | void>{
    const {data, error } = await this.supabase.auth.updateUser({
      password: password
    })

    if (error) {{
      return error;
    }}
  }

  async uploadAvatar(fileName: string, avatarFile: File): Promise<any> {
    const generatedName = Date.now().toString();
    const nameToArray = fileName.split('.');
    const newFileName = `${generatedName}.${
      nameToArray[nameToArray.length - 1]
    }`;
    const { data, error } = await this.supabase.storage
      .from('avatars')
      .upload(`avatars/${newFileName}`, avatarFile);

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.sessionSubscription?.unsubscribe();
    this.newPassSubscription?.unsubscribe();
  }
}
