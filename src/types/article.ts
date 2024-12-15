export interface IComment {
    user: {
      _id: string;
      name: string;
      email: string;
      profile_picture_url?: string;
    };
    content: string;
    createdAt: string;
  }
  
  export interface IArticle {
    _id: string;
    title: string;
    content: string;
    image?: string;
    author: {
      _id: string;
      name: string;
      email: string;
      profile_picture_url?: string;
    };
    tags: string[];
    slug: string;
    status: 'Published' | 'Draft' | 'Archived';
    views: number;
    likes: number;
    comments: IComment[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface IArticleListResponse {
    data: IArticle[];
    total: number;
    page: number;
    pages: number;
  }
  