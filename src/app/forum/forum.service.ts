import { Injectable } from '@angular/core';
import { Post } from './forum.model';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../authentication/auth.service';

interface PostData {
  content: string;
  postDate: Date;
  posterId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private _posts = new BehaviorSubject<Post[]>([]);

  get posts() {
    return this._posts.asObservable();
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  fetchPosts() {
    return this.http.get<{[key: string]: PostData}>('https://sportskg-4a84d.firebaseio.com/posts.json')
    .pipe(map(resData => {
      const posts = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          posts.push(new Post(key, resData[key].content, resData[key].postDate, resData[key].posterId));
        }
      }
      return posts;
    }),
    tap(posts => {
      this._posts.next(posts);
    })
    );
  }

  getPost(id: string) {
    return this.http
    .get<PostData>(`https://sportskg-4a84d.firebaseio.com/posts/${id}.json`)
    .pipe(
      map(postData => {
        return new Post(id, postData.content, postData.postDate, postData.posterId);
      })
    );
  }

  addPost(content: string) {
    let generatedId: string;
    let newPost: Post;
    return this.authService.userId.pipe(take(1), switchMap(userId => {
      if (!userId) {
        throw new Error('No user id found!');
      }
      newPost = new Post(
        Math.random().toString(),
        content,
        new Date(),
        userId
      );
      return this.http.post<{name: string}>(
        'https://sportskg-4a84d.firebaseio.com/posts.json',
        { ...newPost, id: null }
      );
    }), switchMap(resData => {
          generatedId = resData.name;
          return this.posts;
        }),
        take(1),
        tap(posts => {
          newPost.id = generatedId;
          this._posts.next(posts.concat(newPost));
          }
        )
    );
  }
}
