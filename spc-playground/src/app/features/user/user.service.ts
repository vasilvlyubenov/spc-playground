import { Injectable, OnDestroy } from '@angular/core';
import {
  SupabaseClient,
  AuthSession,
  createClient,
  AuthChangeEvent,
  Session,
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable, Subscription, defer, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy{
  private user$$ = new BehaviorSubject<any>(undefined);
  public user$ = this.user$$.asObservable();

  subscription!: Subscription
  sessionSubscription: Subscription | undefined;
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;
  user!: Object | undefined;

  
  get session(): Session | null {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });

    return this._session;
  }

  get isLogged(): Object | null {
    return !!this.user;
  }


  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    // this.sessionSubscription = defer(() =>this.supabase.auth.getSession()).subscribe({
    //   next: ({ data, error }) => {
    //     if (error) {
    //       throw error;
    //     }

    //     this.user = data.session;
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // });

    this.subscription = this.user$.subscribe((user) => {
      if (!user) {
        return
      } 
      
      if (user.data) {
        this.user = user;
      } else {
        this.user = undefined;
      }
    });

  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signUp(email: string, password: string): Observable<any> {
    const register$ = defer(() => this.supabase.auth.signUp({ email, password })).pipe(tap((data) => this.user$$.next(data)));
    return register$;
  }

  signIn(email: string, password: string): Observable<any> {
    const login$ = defer(() =>
      this.supabase.auth.signInWithPassword({ email, password })
    ).pipe(tap((data) => this.user$$.next(data)));

    return login$
  }

  signOut(): Observable<any> {
    this.removeToken();
    return defer(() => this.supabase.auth.signOut()).pipe(tap((data) => this.user$$.next(data)));
  }

  refreshSession(data: any) : Observable<any> {
    return defer(() => this.supabase.auth.refreshSession(data)).pipe(tap((data) => this.user$$.next(data)));
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
      this.sessionSubscription?.unsubscribe();
  } 

  setToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('refresh_token');
  }
}
