import { Injectable, OnDestroy } from '@angular/core';
import {
  SupabaseClient,
  createClient,
  UserResponse,
  AuthResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable, Subscription, defer, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private user$$ = new BehaviorSubject<any>(undefined);
  public user$ = this.user$$.asObservable();

  userSubscription!: Subscription;
  sessionSubscription: Subscription | undefined;
  newPassSubscription: Subscription | undefined;
  private supabase: SupabaseClient;
  user!: UserResponse | undefined;

  getSession() {
    return defer(() => this.supabase.auth.getSession())
  }

  get isLogged(): Object | null {
    return !!this.user?.data.user;
  }

  get userData(): UserResponse | undefined {
    return this.user;
  }

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.userSubscription = this.user$.subscribe((user) => {
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

  getUser():Observable<UserResponse> {
    return defer(() => this.supabase.auth.getUser());
  }

  signUp(email: string, password: string): Observable<AuthResponse> {
    const register$ = defer(() =>
      this.supabase.auth.signUp({ email, password })
    ).pipe(tap((data) => this.user$$.next(data)));
    return register$;
  }

  signIn(email: string, password: string): Observable<AuthResponse> {
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

  refreshSession(data: any): Observable<AuthResponse> {
    return defer(() => this.supabase.auth.refreshSession(data)).pipe(
      tap((data) => this.user$$.next(data))
    );
  }

  updatePassword(password: string): Observable<any>{
    return defer(() =>  this.supabase.auth.updateUser({password: password}));
  }

  async uploadAvatar(fileName: string, avatarFile: File): Promise<any> {
    const generatedName = Date.now().toString();
    const nameToArray = fileName.split('.');
    const newFileName = `${generatedName}.${
      nameToArray[nameToArray.length - 1]
    }`;
    const { data, error } = await this.supabase.storage
      .from('public')
      .upload(`avatars/${newFileName}`, avatarFile);

    if (error) {
      console.error(error);
      throw error;
    }
    
    return data;
  }

  getUserAvatarURL(avatarPath: string) {
    return this.supabase.storage.from('public').getPublicUrl(avatarPath).data.publicUrl;
  }

  async updateUserAvatar(avatarPath: string, avatarFile: File): Promise<any> {
    const {data, error} = await this.supabase.storage.from('public').update(`public/${avatarPath}`, avatarFile, {
      cacheControl: '3600',
      upsert: true,
    })
    console.log(data);
    
    if (error) {
        console.error(error);
        throw error;
    }

    return data;
  }

  async uploadDrawing(fileName: string, avatarFile: File): Promise<any> {
    const generatedName = Date.now().toString();
    const nameToArray = fileName.split('.');
    const newFileName = `${generatedName}.${
      nameToArray[nameToArray.length - 1]
    }`;
    const { data, error } = await this.supabase.storage
      .from('public')
      .upload(`drawings/${newFileName}`, avatarFile);

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  getUserInfo(userId: string | undefined): Observable<PostgrestSingleResponse<any>> {
    return defer(() => this.supabase.from('userInfo').select().eq('user_id', userId));
  }

  createUserInfo(userData: Object): Observable<PostgrestSingleResponse<any>> {
    return defer(() => this.supabase.from('userInfo').insert(userData));
  }

  updateUserInfo(userData: Object, userId: string | undefined): Observable<PostgrestSingleResponse<any>> {
    return defer(() => this.supabase.from('userInfo').update(userData).eq('user_id', userId));
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.sessionSubscription?.unsubscribe();
    this.newPassSubscription?.unsubscribe();
  }
}
